import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanRoutingModule } from "./scan-routing.module";
import { ScanBarcodeComponent } from './scan-barcode/scan-barcode.component';
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
    declarations: [
        ScanBarcodeComponent
    ],
    exports: [
        ScanBarcodeComponent
    ],
  imports: [
    CommonModule,
    ScanRoutingModule,
    ZXingScannerModule,
    FontAwesomeModule
  ]
})
export class ScanModule { }
