import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";

import { QueryInputComponent } from './query-input.component';
import { QueryService } from "./query.service";

@NgModule({
  declarations: [
    QueryInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [QueryService],
  exports: [
    QueryInputComponent
  ]
})
export class QueryInputModule { }
