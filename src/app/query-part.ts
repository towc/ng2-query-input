import {QueryCategory} from "./query-category";

export class QueryPart {
  category: QueryCategory;
  value: string;

  constructor(category?: QueryCategory, value?: string) {
    if(typeof category !== 'undefined') this.category = category;
    if(typeof value !== 'undefined') this.value = value;
  }
}
