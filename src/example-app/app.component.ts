import { Component } from '@angular/core';
import {QueryCategory} from "../query-input/model/query-category";
import {QueryPart} from "../query-input/model/query-part";
import {Query} from "../query-input/model/query";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Dummy-categories
  categories: Array<QueryCategory> = [];

  // Dummy suggestions
  types: Array<string> = ["A-Type", "B-Type", "C-Type"];
  names: Array<string> = ["Something", "Something more", "Different one"];
  flags: Array<string> = ["Green", "Blue", "Yellow", "Red", "Purple"];

  // Store current and called queries
  currentQuery: Query = new Query([]);
  currentQueryString: string = "";
  calledQuery: Query = new Query([]);

  // Attribute to store the current suggestions in
  suggestions: Array<QueryPart> = [];

  // Creates dummy-categories
  constructor() {
    this.categories.push(new QueryCategory("Type", "Name of the type"));
    this.categories.push(new QueryCategory("Name", "Part of the name"));
    this.categories.push(new QueryCategory("Flag", "Color of the flag"));

    this.fetchAutocompleteSuggestions(new QueryPart(null, ""));
  }

  /**
   * Generates autocomplete-suggestions
   *
   * @param currentValue
   * @returns {Array<QueryPart>}
   */
  fetchAutocompleteSuggestions(currentValue: QueryPart): void {
    console.log("Suggestions-fetch");

    this.suggestions = [];

    // Show category-suggestions only if no category is selected or the value has more than one word
    let words = currentValue.value.split(" ");
    if(currentValue.category == null || words.length > 1) {

      // Try to find a matching category for the last word of the value
      let lastWord = words[words.length-1];
      for(let category of this.categories) {
        if(category.name.toLowerCase().startsWith(lastWord.trim().toLowerCase())) {
          this.suggestions.push(new QueryPart(category, ""));
        }
      }
    }

    // Show value-suggestions defending on the selected category
    switch(currentValue.category) {
      case this.categories[0]:
        for(let type of this.types) {
          if(type.startsWith(currentValue.value.trim()) && type.trim() != currentValue.value.trim()) {
            this.suggestions.push(new QueryPart(currentValue.category, type));
          }
        }
        break;

      case this.categories[1]:
        for(let name of this.names) {
          if(name.indexOf(currentValue.value.trim()) !== -1 && name.trim() != currentValue.value.trim()) {
            this.suggestions.push(new QueryPart(currentValue.category, name));
          }
        }
        break;

      case this.categories[2]:
        for(let flag of this.flags) {
          if(flag.indexOf(currentValue.value.trim()) !== -1 && flag.trim() != currentValue.value.trim()) {
            this.suggestions.push(new QueryPart(currentValue.category, flag));
          }
        }
        break;
    }
  }

  /**
   * Called when query changes
   *
   * @param query
   */
  queryChanged(query: Query) {
    this.currentQuery = query;

    let lastQueryPart = query.parts.length > 0 ? query.parts[query.parts.length - 1] : new QueryPart(null, "");
    this.fetchAutocompleteSuggestions(lastQueryPart);
  }

  /**
   * Called when query is called
   *
   * @param query
   */
  queryCalled(query: Query) {
    this.calledQuery = query;
  }
}
