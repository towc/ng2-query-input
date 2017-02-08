import {QueryPart} from "./query-part";
import {Observable} from "rxjs";

export interface QueryInputDelegate {
  getAutocompleteSuggestions(currentValue: QueryPart): Observable<Array<QueryPart>>;
}
