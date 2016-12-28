import { Component } from '@angular/core';
import {QueryCategory} from "../query-input/model/query-category";
import {QueryPart} from "../query-input/model/query-part";
import {QueryInputDelegate} from "../query-input/model/query-input-delegate";
import {Query} from "../query-input/model/query";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements QueryInputDelegate{

  // Dummy-categories
  categories: Array<QueryCategory> = [];

  // Dummy suggestions
  types: Array<string> = ["ABC", "DEF", "XYZ"];
  names: Array<string> = ["Something", "Something more", "Different one"];

  // Define the delegate for the autocomplete
  queryInputDelegate: QueryInputDelegate = this;

  constructor() {
    this.categories.push(new QueryCategory("Type", "Lorem ipsum"));
    this.categories.push(new QueryCategory("Name", "Dolor sit"));
  }

  /**
   * Generates autocomplete-suggestions
   *
   * @param currentValue
   * @returns {Array<QueryPart>}
   */
  getAutocompleteSuggestions(currentValue: QueryPart): Array<QueryPart> {
    console.log("Suggestions-fetch");

    let suggestions: Array<QueryPart> = [];

    // Show category-suggestions only if no category is selected or the value has more than one word
    let words = currentValue.value.split(" ");
    if(currentValue.category == null || words.length > 1) {

      // Try to find a matching category for the last word of the value
      let lastWord = words[words.length-1];
      for(let category of this.categories) {
        if(category.name.startsWith(lastWord.trim())) {
          suggestions.push(new QueryPart(category, ""));
        }
      }
    }

    // Show value-suggestions defending on the selected category
    switch(currentValue.category) {
      case this.categories[0]:
        for(let type of this.types) {
          if(type.startsWith(currentValue.value.trim()) && type != currentValue.value) {
            suggestions.push(new QueryPart(currentValue.category, type));
          }
        }
        break;

      case this.categories[1]:
        for(let name of this.names) {
          if(name.startsWith(currentValue.value) && name != currentValue.value) {
            suggestions.push(new QueryPart(currentValue.category, name));
          }
        }
        break;
    }

    return suggestions;
  }

  /**
   * Todo
   *
   * @param query
   */
  queryCalled(query: Query) {
    console.log(query);
  }
}