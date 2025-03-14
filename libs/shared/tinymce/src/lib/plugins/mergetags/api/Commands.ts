import { Fun } from '@ephox/katamari';

import { Editor } from 'tinymce';

import * as MergeTags from '../core/MergeTags';

const register = (editor: Editor): void => {
  editor.addCommand('dgInsertMergeTag', Fun.curry(MergeTags.insertMergeTag, editor));
};

export { register };
