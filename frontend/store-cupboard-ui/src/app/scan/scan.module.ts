import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanRoutingModule } from "./scan-routing.module";
import { ScanBarcodeComponent } from './scan-barcode/scan-barcode.component';
import { ZXingScannerModule } from "@zxing/ngx-scanner";


@NgModule({
  declarations: [
    ScanBarcodeComponent
  ],
  imports: [
    CommonModule,
    ScanRoutingModule,
    ZXingScannerModule
  ]
})
export class ScanModule { }
