import { Component, Inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface ModalData {
  title: string;
  message: string;
}

const fadeOutDuration = 200;

@Component({
  selector: 'dgs-delete-modal',
  templateUrl: './delete-modal.component.html',
  animations: [
    trigger('opacity', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('opacityTranslateY', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(1rem)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate(`${fadeOutDuration}ms ease-in`, style({ opacity: 0, transform: 'translateY(1rem)' })),
      ]),
    ]),
  ],
})
export class DeleteModalComponent {
  isModal = true;

  constructor(
    private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: ModalData
  ) {}

  close(confirmed: boolean) {
    this.isModal = false;

    // Close the dialog after the animation is done, which is triggered by the isModal change
    setTimeout(() => this.dialogRef.close(confirmed), fadeOutDuration);
  }
}
