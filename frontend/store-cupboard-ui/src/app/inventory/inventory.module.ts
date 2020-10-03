import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { NgbAlertModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AgGridModule } from "ag-grid-angular";

import { ItemModule } from "../item/item.module";
import { SharedModule } from "../shared/shared.module";
import { InventoryRoutingModule } from "./inventory-routing.module";

import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';
import { InventoryDetailNoRowsOverlayComponent } from './inventory-detail-no-rows-overlay/inventory-detail-no-rows-overlay.component';


@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryDetailComponent,
    InventoryDetailNoRowsOverlayComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InventoryRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbTooltipModule,
    SharedModule,
    AgGridModule.withComponents([]),
    ItemModule
  ]
})
export class InventoryModule { }
