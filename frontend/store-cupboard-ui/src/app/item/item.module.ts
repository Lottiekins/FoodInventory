import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { ItemRoutingModule } from "./item-routing.module";

import { ItemListComponent } from './item-list/item-list.component';


@NgModule({
  declarations: [ItemListComponent],
  imports: [
    CommonModule,
    RouterModule,
    ItemRoutingModule
  ]
})
export class ItemModule { }
