import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { NgbAlertModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AgGridModule } from "ag-grid-angular";

import { SharedModule } from "../shared/shared.module";
import { InventoryRoutingModule } from "./inventory-routing.module";

import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';


@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryDetailComponent
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
    AgGridModule.withComponents([])
  ]
})
export class InventoryModule { }
