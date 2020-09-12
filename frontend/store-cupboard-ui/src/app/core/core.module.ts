import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  exports: [
    HeaderComponent,
    FooterComponent,
    LeftSidebarComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
  ]
})
export class CoreModule { }
