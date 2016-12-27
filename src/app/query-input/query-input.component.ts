import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Query} from "../query";
import {QueryCategory} from "../query-category";
import {QueryService} from "../query.service";
import {QueryPart} from "../query-part";
import {QueryInputDelegate} from "../query-input-delegate";

@Component({
  selector: 'query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.css']
})
export class QueryInputComponent implements OnInit {

  @Input() categories: Array<QueryCategory> = [];
  @Input() queryString: string = "";
  @Input() delegate: QueryInputDelegate;
  @Output() queryCalled = new EventEmitter();

  constructor(private queryService: QueryService) { }

  ngOnInit() {
  }

  /**
   * Returns the query-object represented by the current query-string
   *
   * @returns {Query}
   */
  getQuery(): Query {
    return this.queryService.getQueryFromString(this.categories, this.queryString);
  }

  /**
   * Fetches the query-object and calls the callback for an updated query
   */
  enterHandler() {
    this.queryCalled.emit(this.getQuery());
  }

  /**
   * Fetches the autocomplete-suggestions from the delegate and returns them
   *
   * @returns {Array<QueryPart>}
   */
  getAutocompleteSuggestions(): Array<QueryPart> {
    if(!this.delegate) return [];

    // Fetch the last query-part to be passed to the suggestions-callback
    let currentQuery = this.getQuery();
    let parts = currentQuery.parts;
    let lastQueryPart = parts.length > 0 ? parts[parts.length - 1] : new QueryPart(null, "");

    // Return the result of the callback
    return this.delegate.getAutocompleteSuggestions(lastQueryPart);
  }
}
