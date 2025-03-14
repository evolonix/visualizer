import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss'],
})
export class VideoCardComponent {
  @Input() data: any;
  @Output() onUserAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(private utilitiesService: UtilitiesService) {}

  setFallBackImage(imgEl: any) {
    imgEl.src = this.utilitiesService.getDefaultImage(this.data?.referenceType?.toLowerCase());
  }

  getImageUrl() {
    return this.data?.imageUrl ?? this.utilitiesService.getDefaultImage(this.data?.referenceType?.toLowerCase());
  }
  getDuration() {
    let result = `${this.data.referenceType} `;

    if (this.data.dateCreated) {
      result += ` . ${this.data.dateCreated} `;
    }

    if (this.data.durationMinutes) {
      result += ` . ${this.data.durationMinutes}`;
    }
    if (this.data.providerName) {
      result += ` . ${this.data.providerName}`;
    }
    return result;
  }

  onClick(type?: string) {
    this.onUserAction.emit({ ...this.data, type });
  }
}
