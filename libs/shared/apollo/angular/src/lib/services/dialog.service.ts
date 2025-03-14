import { Injectable } from '@angular/core';

import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { ActivationStart, Router } from '@angular/router';

export interface DialogData extends Record<string, unknown> {
  className?: string;
  autoCloseOnRouteChange?: boolean;
}

@Injectable()
export class DialogService {
  isDialogOpen = false;

  private dialogRef?: DialogRef<unknown, ComponentType<unknown>>;

  constructor(
    private dialog: Dialog,
    private router: Router
  ) {}

  /**
   * Open dialog with component as content... close existing dialog if open
   * @param component Component to render in the dialog
   * @param data Parameters to pass to the dialog
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show<T extends DialogData>(component: any, data?: T): void {
    if (this.isDialogOpen) {
      this.close();

      if (data?.autoCloseOnRouteChange) {
        // When the dialog content activates a new route, automatically close the dialog
        this.router.events.subscribe((event) => {
          if (event instanceof ActivationStart) {
            this.close();
          }
        });
      }

      // If show is called while the SAME component is open, then simply close the dialog
      if (this.dialogRef?.componentInstance === component) return;
    }

    this.dialogRef = this.dialog.open(component, {
      width: '100%',
      hasBackdrop: true,
      backdropClass: 'apollo-overlay-dark-backdrop',
      data: { className: 'max-w-xl', ...data },
      maxWidth: '576px', // Match the max width class in the data object above
    });
    this.isDialogOpen = true;

    this.dialogRef.closed.subscribe(() => {
      this.dialogRef = undefined;
      this.isDialogOpen = false;
    });
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = undefined;
      this.isDialogOpen = false;
    }
  }
}
