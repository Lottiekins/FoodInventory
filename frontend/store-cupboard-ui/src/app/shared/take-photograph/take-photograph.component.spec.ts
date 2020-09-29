import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakePhotographComponent } from './take-photograph.component';

describe('TakePhotographComponent', () => {
  let component: TakePhotographComponent;
  let fixture: ComponentFixture<TakePhotographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakePhotographComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakePhotographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
