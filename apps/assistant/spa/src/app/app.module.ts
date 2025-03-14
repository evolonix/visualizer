import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DgxChatbotModule } from '@assistant/chatbot';

import { AppComponent } from './app.component';

@NgModule({
  providers: [],
  declarations: [AppComponent],
  imports: [BrowserModule, DgxChatbotModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
