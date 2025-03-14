import { TestBed } from '@angular/core/testing';

import { DgxChatbotService } from './dgx-chatbot.service';

describe('DgxChatbotService', () => {
  let service: DgxChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DgxChatbotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
