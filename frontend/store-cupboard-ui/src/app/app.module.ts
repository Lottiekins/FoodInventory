import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgGridModule } from 'ag-grid-angular';
import { MomentModule } from "ngx-moment";

import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { ItemModule } from "./item/item.module";
import { InventoryModule } from "./inventory/inventory.module";

import { OpenFoodFactsService } from "./shared/services/openfoodfacts.service";
import { WikipediaApiService } from "./shared/services/wikipedia-api.service";

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    ItemModule,
    InventoryModule,
    FontAwesomeModule,
    MomentModule,
    AgGridModule.withComponents([])
  ],
  providers: [
    OpenFoodFactsService,
    WikipediaApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
