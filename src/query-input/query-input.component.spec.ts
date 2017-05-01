/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QueryInputComponent } from './query-input.component';
import {QueryService} from './query.service';
import {FormsModule} from '@angular/forms';

describe('QueryInputComponent', () => {
  let component: QueryInputComponent;
  let fixture: ComponentFixture<QueryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ QueryInputComponent ],
      providers: [ QueryService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
