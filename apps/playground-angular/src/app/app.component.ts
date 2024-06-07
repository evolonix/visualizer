import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '../components/layout/layout.component';
import { SearchComponent } from '../components/search.component';

@Component({
  standalone: true,
  imports: [RouterModule, LayoutComponent, SearchComponent, DialogModule],
  selector: 'app-root',
  template: `
    <app-layout (search)="handleSearch()" (add)="handleAdd()">
      <router-outlet></router-outlet>
    </app-layout>
  `,
})
export class AppComponent {
  constructor(private dialog: Dialog) {}

  handleSearch(): void {
    this.dialog.open(SearchComponent, {
      width: '100%',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      data: { className: 'max-w-xl' },
      maxWidth: '576px', // Match the max width class in the data object above
    });
  }

  handleAdd(): void {
    // TODO: Show add dialog
  }
}
