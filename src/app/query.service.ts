import { Injectable } from '@angular/core';
import {Query} from "./query";
import {QueryCategory} from "./query-category";
import {QueryPart} from "./query-part";

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
    let lastCategory: QueryCategory = null;
    let lastCategoryIndex = -1;

    for(let category of categories) {
      let categoryIndex = queryString.lastIndexOf(category.name + this.categoryValueSeparator);
      if(categoryIndex > lastCategoryIndex) {
        lastCategory = category;
        lastCategoryIndex = categoryIndex;
      }
    }

    if(lastCategory != null) {
      let remainingQueryString = queryString.substr(0, lastCategoryIndex).trim();
      let queryPartValueIndex = lastCategoryIndex + lastCategory.name.length + this.categoryValueSeparator.length;
      let queryPartValue = queryString.substr(queryPartValueIndex);
      let queryPart = new QueryPart(lastCategory, queryPartValue);
      return [queryPart, remainingQueryString];
    }
    return [null, queryString];
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
    if(!lastPart || lastPart.category != appendPart.category) remainingQueryString = queryString;
    let newQuery = remainingQueryString.length > 0 ? remainingQueryString + " " : remainingQueryString;
    newQuery += appendPart.category.name + this.categoryValueSeparator + appendPart.value;
    newQuery += appendPart.value.length > 0 ? " " : "";
    return newQuery;
  }

}
