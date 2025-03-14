import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dgs-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
