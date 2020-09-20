import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { ScanModule } from "../scan/scan.module";

import { ItemRoutingModule } from "./item-routing.module";

import { ItemListComponent } from './item-list/item-list.component';


@NgModule({
  declarations: [ItemListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ItemRoutingModule,
    FontAwesomeModule,
    ScanModule
  ]
})
export class ItemModule { }
