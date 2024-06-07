import { Component, Input } from '@angular/core';

@Component({
  template: '',
})
export abstract class BaseIconComponent {
  @Input() className = '';
  @Input() type: 'solid' | 'outline' = 'outline';
  @Input() solidSize: 16 | 20 | 24 = 24;

  isValidIcon(): boolean {
    return (
      ['solid', 'outline'].includes(this.type) &&
      [16, 20, 24].includes(this.solidSize)
    );
  }
}
