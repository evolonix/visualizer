import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent {
  chunks: any[] = [];
  mediaRecorder: any;
  started = false;
  stopped = true;
  @Output() onRecordComplete: EventEmitter<any> = new EventEmitter<any>();

  async startRecording() {
    this.started = true;
    this.stopped = false;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e: any) => {
      this.chunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'audio/webm' });
      this.chunks = [];
      this.sendAudioToBackend(blob);
    };

    this.mediaRecorder.start();
  }

  stopRecording() {
    this.started = false;
    this.stopped = true;
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  sendAudioToBackend(blob: Blob) {
    this.onRecordComplete.emit(blob);
  }
}
