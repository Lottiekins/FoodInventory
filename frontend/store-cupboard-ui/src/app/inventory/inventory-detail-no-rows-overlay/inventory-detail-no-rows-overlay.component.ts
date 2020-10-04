import { Component } from '@angular/core';

import { INoRowsOverlayAngularComp } from "ag-grid-angular";
import { InventoryItemService } from "../services/inventory-item.service";


@Component({
  selector: 'app-inventory-detail-no-rows-overlay',
  templateUrl: './inventory-detail-no-rows-overlay.component.html',
  styleUrls: ['./inventory-detail-no-rows-overlay.component.scss']
})
export class InventoryDetailNoRowsOverlayComponent implements INoRowsOverlayAngularComp {

  private params: any;

  constructor(private inventoryItemService: InventoryItemService) {
  }

  agInit(params): void {
    this.params = params;
    console.log('params:', params);
  }

  onAddItemToInventoryClicked() {
    this.inventoryItemService.triggerOpenAddInventoryItemModal();
  }

}
