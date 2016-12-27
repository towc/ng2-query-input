import {Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef} from '@angular/core';
import {Query} from "../query";
import {QueryCategory} from "../query-category";
import {QueryService} from "../query.service";
import {QueryPart} from "../query-part";
import {QueryInputDelegate} from "../query-input-delegate";

@Component({
  selector: 'query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.scss']
})
export class QueryInputComponent implements OnInit {

  @ViewChild('queryStringInput') queryStringInput: ElementRef;
  @ViewChild('queryInputWrapper') queryInputWrapper: ElementRef;
  @Input() categories: Array<QueryCategory> = [];
  @Input() queryString: string = "";
  @Input() delegate: QueryInputDelegate;
  @Output() queryCalled = new EventEmitter();

  private selectedSuggestion = -1;

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

  /**
   * Appends the provided part to the current query
   *
   * @param part
   */
  appendQueryPart(part: QueryPart) {
    this.queryString = this.queryService.appendQueryPartToQueryString(this.categories, this.queryString, part);
  }

  /**
   * Retuns true if the input for the query-string is focused
   * @returns {boolean}
   */
  isQueryStringInputFocused(): boolean {
    return document.activeElement == this.queryStringInput.nativeElement;
  }

  @HostListener('window:keydown', ['$event'])
  keyboardListener(event: any) {
    if(!this.isQueryStringInputFocused()) return;

    const upKeyCode = 38;
    const downKeyCode = 40;
    const enterKeyCode = 13;

    let suggestions = this.getAutocompleteSuggestions();

    // Selection via up- or down-arrow
    if(event.keyCode == upKeyCode) this.selectedSuggestion--;
    if(event.keyCode == downKeyCode) this.selectedSuggestion++;

    // Correct selection based on length of suggestions
    if(this.selectedSuggestion > suggestions.length-1) this.selectedSuggestion = 0;
    if(this.selectedSuggestion < -1) this.selectedSuggestion = -1;

    // Perform select on enter
    if(event.keyCode == enterKeyCode && this.selectedSuggestion != -1) {
      this.appendQueryPart(suggestions[this.selectedSuggestion]);
      this.selectedSuggestion = -1;
    }
  }

  /*@HostListener('window:click', ['$event'])
  clickListener(event: any) {
    console.log(this.queryInputWrapper.nativeElement.contains(event.toElement));
  }*/

  selectSuggestion(suggestion: number) {
    this.selectedSuggestion = suggestion;
  }
}
