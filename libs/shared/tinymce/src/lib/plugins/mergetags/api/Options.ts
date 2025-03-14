import { Type } from '@ephox/katamari';

import { Editor, EditorOptions } from 'tinymce';

import { ExternalMergeTag } from '../core/Types';

const option: {
  <K extends keyof EditorOptions>(name: K): (editor: Editor) => EditorOptions[K];
  <T>(name: string): (editor: Editor) => T;
} = (name: string) => (editor: Editor) => editor.options.get(name);

const register = (editor: Editor): void => {
  const registerOption = editor.options.register;

  registerOption('mergetags_list', {
    processor: (value) => Type.isArrayOf(value, Type.isObject),
    default: [],
  });
};

const getMergeTags = option<ExternalMergeTag[]>('mergetags_list');

export { register, getMergeTags };
