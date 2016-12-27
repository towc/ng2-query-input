import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Query} from "../query";
import {QueryCategory} from "../query-category";
import {QueryService} from "../query.service";
import {QueryPart} from "../query-part";

@Component({
  selector: 'query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.css']
})
export class QueryInputComponent implements OnInit {

  @Input() categories: Array<QueryCategory> = [];
  @Input() queryString: string = "";
  @Input() autocompleteSuggestions: (queryPart: QueryPart) => Array<QueryPart> = () => [];
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
   * Todo
   *
   * @returns {Array<QueryPart>}
   */
  getAutocompleteSuggestions(): Array<QueryPart> {

    // Fetch the last query-part to be passed to the suggestions-callback
    let currentQuery = this.getQuery();
    let lastQueryPart = currentQuery.parts.length > 0 ? currentQuery.parts[0] : new QueryPart(null, "");

    // Return the result of the callback
    return this.autocompleteSuggestions(lastQueryPart);
  }

}
