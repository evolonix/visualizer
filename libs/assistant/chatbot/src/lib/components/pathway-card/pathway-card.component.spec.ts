import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayCardComponent } from './pathway-card.component';

describe('PathwayCardComponent', () => {
  let component: PathwayCardComponent;
  let fixture: ComponentFixture<PathwayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PathwayCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.skip('should create', () => {
    expect(component).toBeTruthy();
  });
});
