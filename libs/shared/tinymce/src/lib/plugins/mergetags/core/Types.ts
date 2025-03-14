import { Ui } from 'tinymce';

export interface MergeTag {
  readonly title: string;
  readonly value?: string;
  readonly menu?: MergeTag[];
}

export type ExternalMergeTag = MergeTag;

export type InternalMergeTag = Ui.Menu.NestedMenuItemContents;
