import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@NgModule({
  // prettier-ignore
  imports: [
    CommonModule, 
    EditorModule, 
  ],
  exports: [EditorModule],
  // prettier-ignore
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: '/tinymce/tinymce.min.js' } // used when self-hosting TinyMCE
  ],
})
export class TinyMCEModule {}
