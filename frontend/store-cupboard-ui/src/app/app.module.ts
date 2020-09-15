import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';

import { ScanModule } from "./scan/scan.module";

import { ScanBackendService } from "./scan/service/scan-backend-service.service";

import { AppComponent } from './app.component';
import { CoreModule } from "./core/core.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    ScanModule,
    CoreModule,
  ],
  providers: [ScanBackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
