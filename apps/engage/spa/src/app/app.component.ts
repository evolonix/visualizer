import { Component } from '@angular/core';
import { DEGREED_CONFIGURATION } from '@degreed/apollo-angular';

import { SearchDialogService } from '../components/search-dialog/search-dialog.service';

@Component({
  selector: 'dgs-app',
  template: `
    <da-layout [configuration]="configuration" (search)="handleSearch()" (addContent)="handleAddContent()" className="tw-reset">
      <router-outlet></router-outlet>
    </da-layout>
  `,
})
export class AppComponent {
  configuration = DEGREED_CONFIGURATION;

  constructor(private searchDialogService: SearchDialogService) {}

  handleSearch(): void {
    // Toggle the search dialog
    if (this.searchDialogService.isDialogOpen) {
      this.searchDialogService.closeDialog();
      return;
    }

    this.searchDialogService.openDialog();
  }

  handleAddContent(): void {
    // TODO: Show add dialog
  }
}
