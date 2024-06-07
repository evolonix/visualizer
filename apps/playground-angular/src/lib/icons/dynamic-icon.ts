import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { BaseIconComponent } from './components/_base';
import { iconComponent } from './components/_registry';

@Component({
  selector: 'app-dynamic-icon',
  template: '<ng-template #container></ng-template>',
})
export class DynamicIconComponent
  extends BaseIconComponent
  implements OnChanges
{
  @Input() icon = '';

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  ngOnChanges(): void {
    this.loadComponent();
  }

  private loadComponent() {
    const component = iconComponent(this.icon); // look up component in Icon registry
    if (component) {
      this.container.clear();
      const ref = this.container.createComponent(component);
      ref.setInput('className', this.className);
      ref.setInput('type', this.type);
      ref.setInput('solidSize', this.solidSize);
    }
  }
}
