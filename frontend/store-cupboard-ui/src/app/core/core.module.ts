import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CoreRoutingModule } from "./core-routing.module";

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LeftSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreRoutingModule,
    NgbModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LeftSidebarComponent
  ]
})
export class CoreModule { }
