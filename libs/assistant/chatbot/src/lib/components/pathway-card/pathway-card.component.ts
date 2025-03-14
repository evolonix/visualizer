import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'pathway-card',
  templateUrl: './pathway-card.component.html',
  styleUrls: ['./pathway-card.component.scss'],
})
export class PathwayCardComponent {
  @Input() data: any;
  @Output() onUserAction: EventEmitter<any> = new EventEmitter<any>();
  constructor(private utilitiesService: UtilitiesService) {}

  onClick() {
    if (this.data.url) {
      window.open(this.data.url, '_blank');
    } else {
      this.onUserAction.emit(this.data);
    }
  }

  getImageUrl() {
    return this.data?.imageUrl ?? this.utilitiesService.getDefaultImage(this.data?.referenceType?.toLowerCase());
  }

  setFallBackImage(imgEl: any) {
    imgEl.src = this.utilitiesService.getDefaultImage(this.data?.referenceType?.toLowerCase());
  }

  getDescription() {
    let result = `${this.data.referenceType} `;
    if (this.data.referenceType === 'Target') {
      result = 'Plan ';
    }

    if (this.data.dateCreated) {
      result += ` . ${this.data.dateCreated} `;
    }

    if (this.data.durationMinutes) {
      result += ` . ${this.data.durationMinutes}`;
    }

    return `${result}`;
  }
}
