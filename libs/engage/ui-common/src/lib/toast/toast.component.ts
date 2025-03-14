import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface ToastData {
  message: string;
}

const fadeOutDuration = 100;

@Component({
  selector: 'dgs-toast',
  templateUrl: './toast.component.html',
  animations: [
    trigger('opacityTranslateY', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(0.5rem)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate(`${fadeOutDuration}ms ease-in`, style({ opacity: 0, transform: 'translateY(0.5rem)' })),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  isNotification = true;

  private toastTimer?: number;

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: ToastData
  ) {}

  ngOnInit(): void {
    this.startTimer();
  }

  close() {
    this.isNotification = false;

    // Close the dialog after the animation is done, which is triggered by the isNotification change
    setTimeout(() => this.dialogRef.close(), fadeOutDuration);
  }

  @HostListener('mouseenter')
  pauseTimer() {
    clearTimeout(this.toastTimer);
  }

  @HostListener('mouseleave')
  startTimer() {
    // Schedule a timer to automatically close the dialog after 2 seconds
    this.toastTimer = window.setTimeout(() => this.close(), 2000);
  }
}
