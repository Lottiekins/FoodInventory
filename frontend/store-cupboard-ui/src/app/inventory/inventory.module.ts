import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { InventoryRoutingModule } from "./inventory-routing.module";

import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [InventoryListComponent],
  imports: [
    CommonModule,
    RouterModule,
    InventoryRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbAlertModule
  ]
})
export class InventoryModule { }
