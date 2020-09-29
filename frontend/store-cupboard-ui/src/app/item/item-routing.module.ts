import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemListComponent } from "./item-list/item-list.component";
import { ItemDetailComponent } from "./item-detail/item-detail.component";


const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: ':id', component: ItemDetailComponent }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
