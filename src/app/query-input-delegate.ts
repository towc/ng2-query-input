import {QueryPart} from "./query-part";

export interface QueryInputDelegate {
  getAutocompleteSuggestions(currentValue: QueryPart): Array<QueryPart>;
}
