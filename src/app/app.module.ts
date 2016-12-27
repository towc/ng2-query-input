import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { QueryInputComponent } from './query-input/query-input.component';
import {QueryService} from "./query.service";

@NgModule({
  declarations: [
    AppComponent,
    QueryInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [QueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
