import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScanBarcodeComponent } from "./scan-barcode/scan-barcode.component";

const routes: Routes = [
  { path: '', component: ScanBarcodeComponent },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ScanRoutingModule { }
