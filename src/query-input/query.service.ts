import { Injectable } from '@angular/core';
import {Query} from "./model/query";
import {QueryCategory} from "./model/query-category";
import {QueryPart} from "./model/query-part";

@Injectable()
export class QueryService {

  // String to separate category-names an the values
  private categoryValueSeparator = ": ";

  /**
   * Creates a query-object from a query-string. The string can have the following syntax:
   * <CategoryName1>: <Value1> <CategoryName2>: <Value2>
   *
   * If the query-string starts with a string that is not in the list of categories, the query-object will have a part
   * with a null-category and the string as value.
   *
   * @param categories
   * @param queryString
   * @returns {Query}
   */
  public getQueryFromString(categories: Array<QueryCategory>, queryString: string): Query {
    let queryParts: Array<QueryPart> = [];
    let remainingQueryString: string = queryString;

    while(true) {
      let lastPart: QueryPart;
      [lastPart, remainingQueryString] = this.popLastQueryPartFromString(categories, remainingQueryString);

      if(lastPart === null) {
        if(remainingQueryString.length > 0) {
          queryParts.unshift(new QueryPart(null, remainingQueryString));
        }
        break;
      }

      queryParts.unshift(lastPart);
    }

    return new Query(queryParts);
  }

  /**
   * Extracts the last query-part and returns it and the shortened query-string
   *
   * @param categories
   * @param queryString
   * @returns {[*,string]}
   */
  private popLastQueryPartFromString(categories: Array<QueryCategory>, queryString: string): [QueryPart, string] {

    let lastPartRegexString = "([^\\s\"']*|(\"([^\"]*)\")|('([^']*)'))$";

    // Try to match categories or the default category
    for(let category of categories.concat([null])) {
      let categoryPart = category ? category.name + this.categoryValueSeparator.trim() + "\\s*" : "";
      let regexStr =  categoryPart + lastPartRegexString;
      let regex = new RegExp(regexStr);
      let match = queryString.trim().match(regex);

      if(match && match[0].length > 0) {
        // Pick the correct match to not have quotes in result string
        let value = match[5] || match[3] || match[1] || "";
        let queryPart = new QueryPart(category, value);
        let remainingQueryString = queryString.trim().replace(regex, "").trim();
        return [queryPart, remainingQueryString];
      }
    }
    return [null, queryString.trim()];
  }

  /**
   * Appends the provided query-part to the query-string and returns the combined query-string.
   *
   * @param categories
   * @param queryString
   * @param appendPart
   */
  public appendQueryPartToQueryString(categories: Array<QueryCategory>, queryString: string, appendPart: QueryPart) {
    let lastPart: QueryPart, remainingQueryString: string;
    [lastPart, remainingQueryString] = this.popLastQueryPartFromString(categories, queryString);

    let newQuery;

    // If the current query has no last part it can be fully replaced
    if(!lastPart) {
      newQuery = "";
    }

    // If the category of the last part matches to one to be appended, it means that only the value should be updated
    else if(lastPart.category == appendPart.category) {
      newQuery = remainingQueryString;
    }

    // The category is different, so a new one will be added
    else {
      newQuery = queryString;

      // Remove the beginning of the category-name if it was typed
      let categoryName = appendPart.category.name;
      for(let i=categoryName.length; i > 0 ; i--) {
        if(newQuery.toLowerCase().endsWith(categoryName.toLowerCase().substr(0, i))) {
          newQuery = newQuery.slice(0, -i);
        }
      }
    }

    // Trim the query an add a whitespace only if the query is not empty
    newQuery = newQuery.trim();
    newQuery += newQuery.length > 0 ? " " : "";

    let value = appendPart.value.indexOf(" ") == -1 ? appendPart.value : '"' + appendPart.value + '"';

    // Now that the current query is cleaned up, the actual append can start
    newQuery += appendPart.category.name + this.categoryValueSeparator + value;
    return newQuery;
  }

}
