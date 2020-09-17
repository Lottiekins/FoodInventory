import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { InventoryRoutingModule } from "./inventory-routing.module";

import { InventoryListComponent } from './inventory-list/inventory-list.component';


@NgModule({
  declarations: [InventoryListComponent],
  imports: [
    CommonModule,
    RouterModule,
    InventoryRoutingModule
  ]
})
export class InventoryModule { }
