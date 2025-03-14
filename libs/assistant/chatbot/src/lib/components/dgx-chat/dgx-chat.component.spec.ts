import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgxChatComponent } from './dgx-chat.component';

describe('DgxChatComponent', () => {
  let component: DgxChatComponent;
  let fixture: ComponentFixture<DgxChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DgxChatComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgxChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
