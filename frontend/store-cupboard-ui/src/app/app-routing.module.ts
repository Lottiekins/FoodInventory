import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./core/core.module').then(mod => mod.CoreModule) },
  { path: 'inventories', loadChildren: () => import('./inventory/inventory.module').then(mod => mod.InventoryModule) },
  { path: 'items', loadChildren: () => import('./item/item.module').then(mod => mod.ItemModule) },
  { path: 'scan', loadChildren: () => import('./scan/scan.module').then(mod => mod.ScanModule) },
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
