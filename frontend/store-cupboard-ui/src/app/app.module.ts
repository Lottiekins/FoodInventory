import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from "./core/core.module";
import { ItemModule } from "./item/item.module";
import { InventoryModule } from "./inventory/inventory.module";
import { ScanModule } from "./scan/scan.module";

import { ScanBackendService } from "./scan/services/scan-backend-service.service";

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    CoreModule,
    ItemModule,
    InventoryModule,
    ScanModule
  ],
  providers: [ScanBackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
