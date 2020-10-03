import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailNoRowsOverlayComponent } from './inventory-detail-no-rows-overlay.component';

describe('InventoryDetailNoRowsOverlayComponent', () => {
  let component: InventoryDetailNoRowsOverlayComponent;
  let fixture: ComponentFixture<InventoryDetailNoRowsOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryDetailNoRowsOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailNoRowsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
