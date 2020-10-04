import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailBtnCellRendererComponent } from './inventory-detail-btn-cell-renderer.component';

describe('InventoryDetailOpenCellRendererComponent', () => {
  let component: InventoryDetailBtnCellRendererComponent;
  let fixture: ComponentFixture<InventoryDetailBtnCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryDetailBtnCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailBtnCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
