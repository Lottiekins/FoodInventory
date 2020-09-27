import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakePhotographComponent } from './take-photograph/take-photograph.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [TakePhotographComponent],
  exports: [
    TakePhotographComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
