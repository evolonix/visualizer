import TinyMCE, { Editor, Ui } from 'tinymce';

import * as MergeTags from '../core/MergeTags';
import { ExternalMergeTag, InternalMergeTag } from '../core/Types';

const onSetupEditable =
  (editor: Editor) =>
  (api: Ui.Toolbar.ToolbarButtonInstanceApi | Ui.Menu.MenuItemInstanceApi): VoidFunction => {
    const nodeChanged = () => {
      api.setEnabled(editor.selection.isEditable());
    };

    editor.on('NodeChange', nodeChanged);
    nodeChanged();

    return () => {
      editor.off('NodeChange', nodeChanged);
    };
  };

const register = (editor: Editor): void => {
  const insertMergeTag = (value: string | undefined) => editor.execCommand('dgInsertMergeTag', false, value);

  const createMergeTags = (mergeTagList: ExternalMergeTag[] | undefined): InternalMergeTag[] => {
    return TinyMCE.util.Tools.map(mergeTagList, (mergeTag: ExternalMergeTag) => {
      return mergeTag.menu
        ? {
            type: 'nestedmenuitem',
            text: mergeTag.title,
            getSubmenuItems: () => createMergeTags(mergeTag.menu),
          }
        : {
            type: 'menuitem',
            text: mergeTag.title,
            onAction: () => insertMergeTag(mergeTag.value),
          };
    });
  };

  const mergeTagList = MergeTags.getMergeTagList(editor)();
  const mergeTags = createMergeTags(mergeTagList);

  editor.ui.registry.addMenuButton('dgmergetags', {
    icon: 'addtag',
    tooltip: 'Insert merge tag',
    onSetup: onSetupEditable(editor),
    fetch: (callback) => {
      callback(mergeTags);
    },
  });

  editor.ui.registry.addNestedMenuItem('dgmergetags', {
    icon: 'addtag',
    text: 'Merge tag',
    onSetup: onSetupEditable(editor),
    getSubmenuItems: () => mergeTags,
  });
};

export { register };
