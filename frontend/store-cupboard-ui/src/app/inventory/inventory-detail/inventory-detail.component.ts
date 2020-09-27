import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs";

import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

import { InventoryService } from "../services/inventory.service";

import { Inventory } from "../models/inventory.model";


@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {

  public inventoryId: number;
  public inventory$: Observable<Inventory>;

  public faCalendarDay = faCalendarDay;

  constructor(private activatedRoute: ActivatedRoute,
              private inventoryService: InventoryService) {
    this.activatedRoute.params.subscribe(params => {
      this.inventoryId = params['id'];
    });
  }

  ngOnInit(): void {
    this.inventory$ = this.inventoryService.getInventory(this.inventoryId);
  }

}
