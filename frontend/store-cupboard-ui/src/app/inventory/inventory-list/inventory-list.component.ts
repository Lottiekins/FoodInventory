import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";

import { InventoryService } from "../services/inventory.service";
import { Inventory } from "../models/inventory.model";


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  inventories$: Observable<Inventory[]>;

  constructor(private inventoryService: InventoryService) {
  }

  ngOnInit(): void {
    this.inventories$ = this.inventoryService.getItems();
  }

}
