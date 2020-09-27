import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryListComponent } from "./inventory-list/inventory-list.component";
import { InventoryDetailComponent } from "./inventory-detail/inventory-detail.component";

const routes: Routes = [
  { path: '', component: InventoryListComponent },
  { path: ':id', component: InventoryDetailComponent }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
