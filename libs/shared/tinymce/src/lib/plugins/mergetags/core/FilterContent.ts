import { Editor } from 'tinymce';

import * as MergeTags from './MergeTags';

const setup = (editor: Editor): void => {
  // Add custom styles
  editor.contentStyles.push(`
    .mce-content-body .dg-merge-tag:hover {
        background-color: rgba(0, 108, 231, .1);
    }

    .mce-content-body .dg-merge-tag-affix {
        background-color: rgba(0, 108, 231, .1);
        color: #006ce7;
    }
  `);

  const mergeTagValues = MergeTags.getMergeTagValues(editor)();

  const setContent = (editor: Editor, content: string) => {
    editor.focus();
    editor.setContent(content);
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };

  // Store the current content before switching to source view
  let originalContent: string | null = null;

  /**
   * When switching to source view, strip the HTML from the merge tags
   */
  editor.on('BeforeGetContent', (e) => {
    const { source_view = false, save = false } = e;
    const content = e.target.contentDocument.body.innerHTML;

    if (source_view) {
      originalContent = content;
    }

    if (source_view || save) {
      const strippedContent = MergeTags.stripHTMLFromMergeTags(content, mergeTagValues);
      e.target.contentDocument.body.innerHTML = strippedContent;
    }
  });

  /**
   * When closing the source view, restore the original content if Cancel was clicked.
   * If Save was clicked, the original content will be forgotten in the BeforeSetContent event.
   */
  editor.on('CloseWindow', () => {
    if (originalContent) {
      setContent(editor, originalContent);
      originalContent = null;
    }
  });

  /**
   * When switching back from source view, re-decorate the merge tags
   */
  editor.on('BeforeSetContent', (e) => {
    const content = e.content;
    const decoratedContent = MergeTags.decorateMergeTags(content, mergeTagValues);

    e.content = decoratedContent;
    originalContent = null;
  });
};

export { setup };
