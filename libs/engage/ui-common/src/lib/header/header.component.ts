import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade, EngageFeatureFlags, FeatureFlagsService } from '@engage/data-access';

import { FeatureFlagsDialogComponent } from '../feature-flags';

@Component({
  selector: 'dgs-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private dialogRef: DialogRef<EngageFeatureFlags, unknown> | undefined;

  constructor(
    private features: FeatureFlagsService,
    private authFacade: AuthFacade,
    private dialog: Dialog,
    private router: Router
  ) {}

  /**
   * NOTE: Currently not used... but could be used to show a dialog with feature flags toggle options
   */
  showFeatureFlags() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open<EngageFeatureFlags>(FeatureFlagsDialogComponent, {
        width: '250px',
        data: this.features.flags,
        hasBackdrop: true,
      });

      this.dialogRef.closed.subscribe((features) => {
        if (features) this.features.updateFlags(features);
        this.dialogRef = undefined;
      });
    }
  }

  logout() {
    this.authFacade.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
