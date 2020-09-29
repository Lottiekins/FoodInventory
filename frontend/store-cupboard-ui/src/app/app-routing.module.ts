import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./core/core.module').then(mod => mod.CoreModule) },
  { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(mod => mod.InventoryModule) },
  { path: 'item', loadChildren: () => import('./item/item.module').then(mod => mod.ItemModule) },
  { path: '**', loadChildren: () => import('./core/core.module').then(mod => mod.CoreModule) },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
      enableTracing: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
