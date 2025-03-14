import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PrimengDependencyListModule } from './_primeng.module';

import {
  AudioMessageComponent,
  AudioRecorderComponent,
  BooksCardComponent,
  CardComponent,
  DgxChatComponent,
  DgxChatbotComponent,
  PathwayCardComponent,
  RatingCardComponent,
  VideoCardComponent,
} from './components';

@NgModule({
  declarations: [
    DgxChatbotComponent,
    DgxChatComponent,
    AudioMessageComponent,
    PathwayCardComponent,
    BooksCardComponent,
    VideoCardComponent,
    AudioRecorderComponent,
    CardComponent,
    RatingCardComponent,
  ],
  imports: [PrimengDependencyListModule, FormsModule, CommonModule],
  exports: [DgxChatbotComponent],
})
export class DgxChatbotModule {}
