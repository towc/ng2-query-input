import {
  Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef,
  OnChanges
} from '@angular/core';
import {Query} from "./model/query";
import {QueryCategory} from "./model/query-category";
import {QueryService} from "./query.service";
import {QueryPart} from "./model/query-part";
import {QueryInputDelegate} from "./model/query-input-delegate";

@Component({
  selector: 'query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.scss']
})
export class QueryInputComponent {

  @ViewChild('queryStringInput') queryStringInput: ElementRef;
  @ViewChild('queryInputWrapper') queryInputWrapper: ElementRef;
  @Input() categories: Array<QueryCategory> = [];
  @Input('queryString') _queryString: string = "";
  @Input() delegate: QueryInputDelegate;
  @Output() queryChanged = new EventEmitter();
  @Output() queryCalled = new EventEmitter();

  private suggestionsVisible: boolean = false;
  private selectedSuggestion: number = -1;

  private lastSuggestions: Array<QueryPart> = null;
  private lastSuggestionsQueryString: string = null;

  constructor(private queryService: QueryService) { }

  get queryString() {
    return this._queryString;
  }

  set queryString(newString: string) {
    this._queryString = newString;
    this.queryChangedHandler();
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
   * Fetches the query-object and calls the callback for a called query
   */
  queryCalledHandler() {
    this.queryCalled.emit(this.getQuery());
  }

  /**
   * Fetches the query-object and calls the callback for a changed query
   */
  queryChangedHandler() {
    this.queryChanged.emit(this.getQuery());
  }

  /**
   * Fetches the autocomplete-suggestions from the delegate and returns them
   *
   * @returns {Array<QueryPart>}
   */
  getAutocompleteSuggestions(): Array<QueryPart> {
    if(!this.delegate) return [];

    // Check if autocomplete needs to be updated or can be returned from cache
    if(this.queryString == this.lastSuggestionsQueryString) return this.lastSuggestions;

    // Fetch the last query-part to be passed to the suggestions-callback
    let currentQuery = this.getQuery();
    let parts = currentQuery.parts;
    let lastQueryPart = parts.length > 0 ? parts[parts.length - 1] : new QueryPart(null, "");

    // Return the result of the callback
    this.lastSuggestionsQueryString = this.queryString;
    this.lastSuggestions = this.delegate.getAutocompleteSuggestions(lastQueryPart);
    return this.lastSuggestions;
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
   * Performs multiple keyboard-actions when the suggestions are visible:
   *  - Move selection with up- and down-arrow
   *  - Trigger query-called-event when the enter-button is pressed and no suggestion is selected
   *  - Hide the suggestions with the esc-key
   *
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  keyboardListener(event: KeyboardEvent) {

    // Reenable suggestions of the input is focused
    if(document.activeElement == this.queryStringInput.nativeElement) {
      this.suggestionsVisible = true;
    }

    // Perform actions only if suggestions are visible
    if(!this.suggestionsVisible) return;

    const upKeyCode = 38;
    const downKeyCode = 40;
    const enterKeyCode = 13;
    const escKeyCode = 27;

    let suggestions = this.getAutocompleteSuggestions();

    // Selection via up- or down-arrow
    if(event.keyCode == upKeyCode) this.selectedSuggestion--;
    if(event.keyCode == downKeyCode) this.selectedSuggestion++;

    // Correct selection based on length of suggestions
    if(this.selectedSuggestion > suggestions.length-1) this.selectedSuggestion = 0;
    if(this.selectedSuggestion < -1) this.selectedSuggestion = -1;

    // Perform select on enter
    if(event.keyCode == enterKeyCode) {
      if(this.selectedSuggestion == -1) {
        this.queryCalledHandler();
      } else {
        this.appendQueryPart(suggestions[this.selectedSuggestion]);
        this.selectedSuggestion = -1;
      }
    }

    // Hide suggestions on esc
    if(event.keyCode == escKeyCode) {
      this.suggestionsVisible = false;
    }
  }

  /**
   * Shows or hides suggestions based on clicks on it or other elements
   * @param event
   */
  @HostListener('window:click', ['$event'])
  clickListener(event: MouseEvent) {
    this.suggestionsVisible = this.queryInputWrapper.nativeElement.contains(event.toElement);
  }

  /**
   * Sets the index of the selected suggestion
   *
   * @param suggestion
   */
  selectSuggestion(suggestion: number) {
    // Mark the selection
    this.selectedSuggestion = suggestion;

    // Todo: Make sure the input remains focused
    this.queryStringInput.nativeElement.focus();
  }
}
