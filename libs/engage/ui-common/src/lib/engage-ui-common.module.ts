import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogModule } from '@angular/cdk/dialog';

import { FeatureFlagsDialogComponent } from './feature-flags';
import { DeleteModalComponent } from './delete-modal';
import { ToastComponent } from './toast';

import { PaginatorComponent } from './paginator/paginator.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProductSwitcherComponent } from './product-switcher';
import { OrgCardComponent } from './org-card/org-card.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, DialogModule, OverlayModule],
  declarations: [
    ToastComponent,
    DeleteModalComponent,
    FeatureFlagsDialogComponent,
    PaginatorComponent,
    HeaderComponent,
    FooterComponent,
    ProductSwitcherComponent,
    OrgCardComponent,
  ],
  exports: [
    ToastComponent,
    DeleteModalComponent,
    FeatureFlagsDialogComponent,
    PaginatorComponent,
    HeaderComponent,
    FooterComponent,
    ProductSwitcherComponent,
  ],
})
export class EngageUiCommonModule {}
