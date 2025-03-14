import { Editor } from 'tinymce';
import * as MergeTags from '../core/MergeTags';

const register = (editor: Editor): void => {
  const insertMergeTag = (value: string | undefined) => editor.execCommand('dgInsertMergeTag', false, value);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAction = (autocompleteApi: any, rng: Range, value: string) => {
    editor.selection.setRng(rng);
    insertMergeTag(value);
    autocompleteApi.hide();
  };

  const mergeTags = MergeTags.getFlatMergeTagList(editor)();

  const getMatchedChars = (value: string) => {
    return mergeTags.filter((tag) => tag?.title.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  };

  editor.ui.registry.addAutocompleter('mergetags', {
    trigger: '{{',
    minChars: 0,
    columns: 1,
    onAction: onAction,
    fetch: (value: string) => {
      return new Promise((resolve) => {
        const results = getMatchedChars(value).map((tag) => ({
          type: 'cardmenuitem',
          value: tag?.value,
          label: tag?.title,
          items: [
            {
              type: 'cardcontainer',
              direction: 'vertical',
              items: [
                {
                  type: 'cardtext',
                  text: tag?.title,
                  name: 'char_name',
                },
              ],
            },
          ],
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve(results as any);
      });
    },
  });
};

export { register };
