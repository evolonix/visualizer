import { Component, Input } from '@angular/core';
import { OrgInfoShort } from '@degreed/core-angular';

@Component({
  selector: 'dgs-org-card',
  templateUrl: './org-card.component.html',
})
export class OrgCardComponent {
  @Input() public org = {} as OrgInfoShort;
}
