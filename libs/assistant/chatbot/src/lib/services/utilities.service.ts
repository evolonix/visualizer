import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { fallbackImages } from '../enums/constants';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  getRandomUID() {
    return uuidv4();
  }

  getDefaultImage(type: string): string {
    if (fallbackImages[type.toLowerCase()]) {
      return fallbackImages[type];
    } else {
      return fallbackImages['default'];
    }
  }
}
