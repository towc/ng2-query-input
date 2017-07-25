/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { QueryService } from './query.service';
import {QueryCategory} from './model/query-category';
import {Query} from './model/query';
import {QueryPart} from './model/query-part';

describe('QueryService', () => {

  console.warn( 'BEGIN TEST: ' + new Date );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryService]
    });
  });

  // Create some dummy-categories
  const someCategories: Array<QueryCategory> = [];
  someCategories.push(new QueryCategory('One', 'The first of all'));
  someCategories.push(new QueryCategory('Two', 'The secound of all'));
  someCategories.push(new QueryCategory('Three', 'The third of all'));
  someCategories.push(new QueryCategory('Four', 'The fourth of all'));
  someCategories.push(new QueryCategory('Five', 'The fifth of all'));

  // Create a dummy-query
  const someQueryString = 'Two: Lorem One: Ipsum Three: Something with whitespaces Four: "Something in quotes"';

  it('should be able to inject the service', inject([QueryService], (service: QueryService) => {
    expect(service).toBeTruthy();
  }));


  it('should contain a getQueryFromString-method', inject([QueryService], (service: QueryService) => {
    expect(service.getQueryFromString).toBeDefined();
  }));

  it('should properly generate queries', inject([QueryService], (service: QueryService) => {

    const someQuery: Query = service.getQueryFromString(someCategories, someQueryString);

    // Check existance
    expect(someQuery).not.toBeNull();

    // Check count of parts
    expect(someQuery.parts.length).toEqual(4);

    // Check categories and their order
    expect(someQuery.parts[0].category).toBe(someCategories[1]);
    expect(someQuery.parts[1].category).toBe(someCategories[0]);
    expect(someQuery.parts[2].category).toBe(someCategories[2]);
    expect(someQuery.parts[3].category).toBe(someCategories[3]);

    // Check values
    expect(someQuery.parts[0].value).toEqual('Lorem');
    expect(someQuery.parts[1].value).toEqual('Ipsum');
    expect(someQuery.parts[2].value).toEqual('Something with whitespaces');
    expect(someQuery.parts[3].value).toEqual('Something in quotes');
  }));

  it('should not fail for empty input', inject([QueryService], (service: QueryService) => {
    const someOtherCategories: Array<QueryCategory> = [];
    const someOtherQueryString = '';

    const someQuery: Query = service.getQueryFromString(someOtherCategories, someOtherQueryString);

    // Check existence
    expect(someQuery).not.toBeNull();
  }));


  it('should contain a appendQueryPartToQueryString-method', inject([QueryService], (service: QueryService) => {
    expect(service.appendQueryPartToQueryString).toBeDefined();
  }));

  it('should properly append categories', inject([QueryService], (service: QueryService) => {
    let someQueryPart, someQuery;
    someQueryPart = new QueryPart(someCategories[4], '');

    someQuery = service.appendQueryPartToQueryString(someCategories, '', someQueryPart);
    expect(someQuery).toEqual('Five: ');

    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString, someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' Five: ');
  }));

  it('should properly append values', inject([QueryService], (service: QueryService) => {
    let someQueryPart, someQuery;

    someQueryPart = new QueryPart(someCategories[3], 'Some Value');
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString, someQueryPart);
    expect(someQuery).toEqual('Two: Lorem One: Ipsum Three: Something with whitespaces Four: "Some Value"');

    someQueryPart = new QueryPart(someCategories[4], 'Value');
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString, someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' Five: Value');

    someQueryPart = new QueryPart(someCategories[4], 'Some Value');
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString, someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' Five: "Some Value"');
  }));

  it('should properly append partials', inject([QueryService], (service: QueryService) => {
    let someQueryPart, someQuery;

    // Partial name already typed
    someQueryPart = new QueryPart(someCategories[4], '');
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString + ' Fiv', someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' Five: ');

    someQueryPart = new QueryPart(someCategories[4], 'Some Value');
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString + ' Five: Some', someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' Five: "Some Value"');
  }));

  it('should properly append text without category', inject([QueryService], (service: QueryService) => {

    let someQueryPart, someQuery;

    // Without whitespace
    someQueryPart = new QueryPart(null, 'No-Whitespace');
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString, someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' No-Whitespace');

    // Partially typed
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString + ' No-', someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' No-Whitespace');

    // With whitespace
    someQueryPart = new QueryPart(null, 'Some Whitespace');
    someQuery = service.appendQueryPartToQueryString(someCategories, someQueryString, someQueryPart);
    expect(someQuery).toEqual(someQueryString + ' "Some Whitespace"');
  }));
});
