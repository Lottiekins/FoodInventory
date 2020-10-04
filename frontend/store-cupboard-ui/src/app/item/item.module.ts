import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { NgbAlertModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { NgxBarcodeModule } from "ngx-barcode";

import { SharedModule } from "../shared/shared.module";

import { ItemRoutingModule } from "./item-routing.module";

import { ItemListComponent } from './item-list/item-list.component';
import { ScanBarcodeComponent } from "../shared/scan-barcode/scan-barcode.component";
import { ItemDetailComponent } from './item-detail/item-detail.component';


@NgModule({
    declarations: [ItemListComponent, ScanBarcodeComponent, ItemDetailComponent],
    exports: [
        ScanBarcodeComponent
    ],
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
        SharedModule,
        NgxBarcodeModule
    ]
})
export class ItemModule { }
