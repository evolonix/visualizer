import { Editor } from 'tinymce';

import * as Options from '../api/Options';
import { ExternalMergeTag } from './Types';

const MERGE_TAG_PREFIX = '<span class="dg-merge-tag" contenteditable="false"><span class="dg-merge-tag-affix">{{</span>';
const MERGE_TAG_SUFFIX = '<span class="dg-merge-tag-affix">}}</span></span>';

/**
 * Decorate the merge tags in the content with HTML
 */
const decorateMergeTags = (html: string, mergeTagValues: string[]): string => {
  return html.replace(new RegExp(`{{((${mergeTagValues.join('|')})?)}}`, 'g'), `${MERGE_TAG_PREFIX}$1${MERGE_TAG_SUFFIX}`);
};

/**
 * Strip the HTML from the merge tags in the content
 */
const stripHTMLFromMergeTags = (html: string, mergeTagValues: string[]): string => {
  return html.replace(new RegExp(`${MERGE_TAG_PREFIX}((${mergeTagValues.join('|')})?)${MERGE_TAG_SUFFIX}`, 'g'), '{{$1}}');
};

const getMergeTagList = (editor: Editor) => {
  return (): ExternalMergeTag[] => {
    const mergeTagList = Options.getMergeTags(editor);
    return mergeTagList;
  };
};

const getFlatMergeTagList = (editor: Editor) => {
  return () => {
    const flatMergeTagList = getMergeTagList(editor)()
      .map((parent) => {
        return parent.menu;
      })
      .flat();
    return flatMergeTagList;
  };
};

/**
 * Get a flattened list of all the merge tag values
 */
const getMergeTagValues = (editor: Editor) => {
  return (): string[] => {
    const getAllValuesFromMergeTags = (mergeTags: ExternalMergeTag[], allValues: string[] = []) => {
      mergeTags.forEach(({ value, menu }) => {
        if (value) {
          allValues.push(value);
        }
        if (menu) {
          getAllValuesFromMergeTags(menu, allValues);
        }
      });

      return allValues;
    };

    const mergeTagList = Options.getMergeTags(editor);

    return getAllValuesFromMergeTags(mergeTagList);
  };
};

/**
 * Insert a merge tag into the editor
 */
const insertMergeTag = (editor: Editor, _ui: boolean, value: string): void => {
  // Note: ui is unused here but is required since this can be called by execCommand
  const mergeTag = `${MERGE_TAG_PREFIX}${value}${MERGE_TAG_SUFFIX}`;

  editor.execCommand('mceInsertContent', false, mergeTag);
  editor.addVisual();
};

export { getMergeTagList, getFlatMergeTagList, getMergeTagValues, insertMergeTag, decorateMergeTags, stripHTMLFromMergeTags };
