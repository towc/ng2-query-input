import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

import { QueryInputComponent } from './query-input.component';
import { QueryService } from './query.service';

@NgModule({
  declarations: [
    QueryInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [QueryService],
  exports: [
    QueryInputComponent
  ]
})
export class QueryInputModule { }
