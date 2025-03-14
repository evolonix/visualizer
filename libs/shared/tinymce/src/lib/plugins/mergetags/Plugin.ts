import { TinyMCE } from 'tinymce';
import * as Commands from './api/Commands';
import * as Options from './api/Options';
import * as FilterContent from './core/FilterContent';
import * as AutoComplete from './ui/AutoComplete';
import * as Buttons from './ui/Buttons';

declare const tinymce: TinyMCE;

export const MergeTagsPlugin = () => {
  tinymce.PluginManager.add('dgmergetags', (editor) => {
    Options.register(editor);
    Buttons.register(editor);
    Commands.register(editor);
    AutoComplete.register(editor);
    FilterContent.setup(editor);
  });
};
