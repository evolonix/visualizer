import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { SearchDialogComponent } from './search-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SearchDialogService {
  isDialogOpen = false;

  private searchRef?: DialogRef<unknown, SearchDialogComponent>;

  constructor(private dialog: Dialog) {}

  openDialog(): void {
    this.searchRef = this.dialog.open(SearchDialogComponent, {
      width: '100%',
      hasBackdrop: true,
      backdropClass: 'apollo-overlay-dark-backdrop',
      data: { className: 'max-w-xl' },
      maxWidth: '576px', // Match the max width class in the data object above
    });
    this.isDialogOpen = true;

    this.searchRef.closed.subscribe(() => {
      this.searchRef = undefined;
      this.isDialogOpen = false;
    });
  }

  closeDialog(): void {
    if (this.searchRef) {
      this.searchRef.close();
      this.searchRef = undefined;
      this.isDialogOpen = false;
    }
  }
}
