import {Component, isDevMode, OnInit} from '@angular/core';
import { Observable } from "rxjs";

import { InventoryService } from "../services/inventory.service";
import { Inventory } from "../models/inventory.model";


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  public inventories$: Observable<Inventory[]>;
  public brandLogoSrc: string;

  constructor(private inventoryService: InventoryService) {
  }

  ngOnInit(): void {
    this.inventories$ = this.inventoryService.getItems();
    this.brandLogoSrc = isDevMode() ? 'assets/images/pantry-egg-brand.png' : './static/ang-src/assets/images/pantry-egg-brand.png';
  }

}
