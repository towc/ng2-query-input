import { Injectable } from '@angular/core';
import {Query} from './model/query';
import {QueryCategory} from './model/query-category';
import {QueryPart} from './model/query-part';

@Injectable()
export class QueryService {

  // String to separate category-names an the values
  private categoryValueSeparator = ': ';

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
    const queryParts: Array<QueryPart> = [];

    
  let lastChar = ''
    , lastWord = ''
    , lastValue = ''
    , isShortcut = false
    , inQuotes = 0;
  for( var i = 0; i < queryString.length; ++i ) {
    var char = queryString[ i ];
    
    if( char === '"' && lastChar !== '\\' && inQuotes !== 1 ) {
      inQuotes = inQuotes ? 0 : 2;
      
      lastChar = char;
      lastWord += char;
    } else
      
    if( char === "'" && lastChar !== '\\' && inQuotes !== 2 ) {
      inQuotes = inQuotes ? 0 : 1;
      
      lastChar = char;
      lastWord += char;
    } else
    
    if( char === ':' && !inQuotes ) {
      
      if( queryParts.length === 0 && lastValue ) {
        queryParts.push({
          category: null, value:
          this.stripValue( lastValue )
        });
        
      } else if( queryParts.length > 0 && queryParts[ queryParts.length - 1 ].value[ 0 ] !== '#' ) {
        queryParts[ queryParts.length - 1 ].value = this.stripValue( lastValue );
        
      }
      
      queryParts.push({
        category: categories.find( category => category.name === lastWord ) || { name: lastWord, description: '' },
        value: ''
      });
      lastWord = '';
      lastValue = '';
      
    } else
      
    if( char === '#' && !inQuotes ) {
      
      if( queryParts.length > 0 ) {
        queryParts[ queryParts.length - 1 ].value = this.stripValue( lastValue );
        lastValue = '';
        lastWord = '';
      } else if( lastValue ) {
        queryParts.push({
          category: null,
          value: this.stripValue( lastValue )
        });
      }
      
      isShortcut = true;
    } else
    
    if( char === ' ' && !inQuotes ) {
      
      if( isShortcut ) {
        queryParts.push({
          category: null,
          value: '#' + lastWord
        });
        lastWord = '';
        lastValue = '';
        isShortcut = false;
      } else {
      
        lastValue += lastWord + char;
        lastWord = '';
      }
    } else
    
    {
      lastChar = char;
      lastWord += char;
    }
    
    if( i === queryString.length - 1 ) {
      
      lastValue += lastWord;
      if( isShortcut ) {
        queryParts.push({
          category: null,
          value: '#' + lastWord
        });
      } else if( queryParts.length > 0 ) {
        queryParts[ queryParts.length - 1 ].value = this.stripValue( lastValue );
      } else {
        queryParts.push({
          category: null,
          value: this.stripValue( lastValue )
        });
      }
    }
  }

  return new Query( queryParts );



    /*
    while (true) {
      let lastPart: QueryPart;
      [lastPart, remainingQueryString] = this.popLastQueryPartFromString(categories, remainingQueryString);

      if (lastPart === null) {
        if (remainingQueryString.length > 0) {
          queryParts.unshift(new QueryPart(null, remainingQueryString));
        }
        break;
      }

      queryParts.unshift(lastPart);
    }

    return new Query(queryParts);*/
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
    remainingQueryString = queryString;
    lastPart = null;

    let newQuery;

    // If the current query has no last part it can be fully replaced
    if (!lastPart) {
      newQuery = '';

    // If the category of the last part matches to one to be appended, it means that only the value should be updated
    } else if (lastPart.category === appendPart.category) {
      newQuery = remainingQueryString;

    // The category is different, so a new one will be added
    } else {
      newQuery = queryString;

      if (appendPart.category) {
        // Remove the beginning of the category-name if it was typed
        const categoryName = appendPart.category.name;
        for (let i = categoryName.length; i > 0 ; i--) {
          if (newQuery.toLowerCase().endsWith(categoryName.toLowerCase().substr(0, i))) {
            newQuery = newQuery.slice(0, -i);
          }
        }
      }
    }

    // Trim the query an add a whitespace only if the query is not empty
    newQuery = newQuery.trim();
    newQuery += newQuery.length > 0 ? ' ' : '';

    const value = appendPart.value.indexOf(' ') === -1 ? appendPart.value : '"' + appendPart.value + '"';

    // Now that the current query is cleaned up, the actual append can start
    newQuery += (appendPart.category ? (appendPart.category.name + this.categoryValueSeparator) : '') + value;
    return newQuery;
  }

  /**
   * Gets a queryPart value and strips it of exterior quotes and spaces
   *
   * @param value
   * @returns {string}
   */
  public stripValue( value: string ): string {
    
    value = value.trim();
    if( value[ 0 ] === '"' && value[ value.length - 1 ] === '"' &&
      value.match( /(^|[^\\])"/g ).length === 2 ) {

      value = value.substring( 1, value.length - 1 );
    
    } else if( value[ 0 ] === "'" && value[ value.length - 1 ] === "'" &&
      value.match( /(^|[^\\])'/g ).length === 2 ) {

      value = value.substring( 1, value.length - 1 );
    }

    return value;
  }

}
