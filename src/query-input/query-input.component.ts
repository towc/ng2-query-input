import {Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, Renderer} from '@angular/core';
import {Query} from "./model/query";
import {QueryCategory} from "./model/query-category";
import {QueryService} from "./query.service";
import {QueryPart} from "./model/query-part";

@Component({
  selector: 'query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.scss']
})
export class QueryInputComponent {

  @ViewChild('queryStringInput')  queryStringInput: ElementRef;
  @ViewChild('queryInputWrapper') queryInputWrapper: ElementRef;

  @Input('categories')  categories: Array<QueryCategory> = [];
  @Input('queryString') _queryString: string = "";
  @Input('placeholder') placeholder: string = "";
  @Input('suggestions') suggestions: Array<QueryPart> = [];

  @Output() queryChange = new EventEmitter();
  @Output() queryStringChange = new EventEmitter();
  @Output() queryCalled = new EventEmitter();

  private suggestionsVisible: boolean = false;
  private selectedSuggestion: number = -1;

  constructor(private queryService: QueryService, private renderer: Renderer) { }

  get queryString() {
    return this._queryString;
  }

  set queryString(newString: string) {
    this._queryString = newString;
    this.queryStringChange.emit(this._queryString);
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
    this.suggestionsVisible = false;
  }

  /**
   * Fetches the query-object and calls the callback for a changed query
   */
  queryChangedHandler() {
    this.queryChange.emit(this.getQuery());
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

    // Selection via up- or down-arrow
    if(event.keyCode == upKeyCode) this.selectedSuggestion--;
    if(event.keyCode == downKeyCode) this.selectedSuggestion++;

    // Correct selection based on length of suggestions
    if(this.selectedSuggestion > this.suggestions.length-1) this.selectedSuggestion = 0;
    if(this.selectedSuggestion < -1) this.selectedSuggestion = -1;

    // Perform select on enter
    if(event.keyCode == enterKeyCode) {
      if(this.selectedSuggestion == -1) {
        this.queryCalledHandler();
      } else {
        let selectedSuggestion = this.suggestions[this.selectedSuggestion];
        if(selectedSuggestion) this.appendQueryPart(selectedSuggestion);
        this.selectedSuggestion = -1;
      }
    }

    // Hide suggestions on esc
    if(event.keyCode == escKeyCode) {
      if(this.suggestionsVisible) {
        this.suggestionsVisible = false;
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  /**
   * Shows or hides suggestions based on clicks on it or other elements
   * @param event
   */
  @HostListener('window:click', ['$event'])
  clickListener(event: MouseEvent) {
    this.suggestionsVisible = this.queryInputWrapper.nativeElement.contains(event.toElement);

    if(this.suggestionsVisible) {
      // Make sure the input remains focused
      this.renderer.invokeElementMethod(this.queryStringInput.nativeElement, 'focus', []);
    }
  }

  /**
   * Sets the index of the selected suggestion
   *
   * @param suggestion
   */
  selectSuggestion(suggestion: number) {
    // Mark the selection
    this.selectedSuggestion = suggestion;
  }
}
