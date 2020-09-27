import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { NgbAlertModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ZXingScannerModule } from "@zxing/ngx-scanner";

import { SharedModule } from "../shared/shared.module";

import { ItemRoutingModule } from "./item-routing.module";

import { ItemListComponent } from './item-list/item-list.component';
import { ScanBarcodeComponent } from "../shared/scan-barcode/scan-barcode.component";


@NgModule({
  declarations: [ItemListComponent, ScanBarcodeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ItemRoutingModule,
    FontAwesomeModule,
    NgbAlertModule,
    FormsModule,
    NgbTooltipModule,
    ZXingScannerModule,
    SharedModule
  ]
})
export class ItemModule { }
