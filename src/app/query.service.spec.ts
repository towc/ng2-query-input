/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueryService } from './query.service';
import {QueryCategory} from "./query-category";
import {Query} from "./query";

describe('QueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryService]
    });
  });

  it('should be able to inject the service', inject([QueryService], (service: QueryService) => {
    expect(service).toBeTruthy();
  }));

  it('should contain a getQueryFromString-method', inject([QueryService], (service: QueryService) => {
    expect(service.getQueryFromString).toBeDefined();
  }));

  it('should properly generate queries', inject([QueryService], (service: QueryService) => {
    let someCategories: Array<QueryCategory> = [];
    someCategories.push(new QueryCategory("One", "The first of all"));
    someCategories.push(new QueryCategory("Two", "The secound of all"));
    someCategories.push(new QueryCategory("Three", "The third of all"));
    someCategories.push(new QueryCategory("Four", "The fourth of all"));

    let someQueryString = "Two: Lorem One: Ipsum Three: Something with whitespaces";

    let someQuery: Query = service.getQueryFromString(someCategories, someQueryString);

    // Check existance
    expect(someQuery).not.toBeNull();

    // Check count of parts
    expect(someQuery.parts.length).toEqual(3);

    // Check categories and their order
    expect(someQuery.parts[0].category).toBe(someCategories[1]);
    expect(someQuery.parts[1].category).toBe(someCategories[0]);
    expect(someQuery.parts[2].category).toBe(someCategories[2]);

    // Check values
    expect(someQuery.parts[0].value).toEqual("Lorem");
    expect(someQuery.parts[1].value).toEqual("Ipsum");
    expect(someQuery.parts[2].value).toEqual("Something with whitespaces");
  }));
});
