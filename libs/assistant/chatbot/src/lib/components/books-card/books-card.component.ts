import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'books-card',
  templateUrl: './books-card.component.html',
  styleUrls: ['./books-card.component.scss'],
})
export class BooksCardComponent {
  @Input() data: any;
  @Output() onUserAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(private utilitiesService: UtilitiesService) {}
  onClick() {
    this.onUserAction.emit(this.data);
  }

  getImageUrl() {
    return this.data?.imageUrl ?? this.utilitiesService.getDefaultImage(this.data?.referenceType?.toLowerCase());
  }

  setFallBackImage(imgEl: any) {
    imgEl.error = null;
    imgEl.src = this.utilitiesService.getDefaultImage(this.data?.referenceType?.toLowerCase());
  }

  getDescription() {
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
}
