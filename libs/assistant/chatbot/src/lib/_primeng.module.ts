import { NgModule } from '@angular/core';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  exports: [ListboxModule, ToastModule, TooltipModule, ProgressBarModule, RatingModule, InputTextareaModule],
})
export class PrimengDependencyListModule {}
