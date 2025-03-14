import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgxChatbotComponent } from './dgx-chatbot.component';

describe('DgxChatbotComponent', () => {
  let component: DgxChatbotComponent;
  let fixture: ComponentFixture<DgxChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DgxChatbotComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgxChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.skip('should create', () => {
    expect(component).toBeTruthy();
  });
});
