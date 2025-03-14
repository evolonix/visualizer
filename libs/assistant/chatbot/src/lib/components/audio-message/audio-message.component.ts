import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'audio-message',
  templateUrl: './audio-message.component.html',
  styleUrls: ['./audio-message.component.css'],
})
export class AudioMessageComponent implements OnInit {
  @Input() message: any;
  audioUrl: any;
  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.audioUrl = this._sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(this.message.blob));
  }
}
