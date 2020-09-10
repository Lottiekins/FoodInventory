import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from "./app.component";

const routes: Routes = [
  { path: '', loadChildren: () => import('./core/core.module').then(mod => mod.CoreModule) },
  { path: 'scan', loadChildren: () => import('./scan/scan.module').then(mod => mod.ScanModule) },
  { path: '**', component: AppComponent },
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
