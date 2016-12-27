import {QueryCategory} from "./query-category";

export class QueryPart {
  category: QueryCategory;
  value: string;

  constructor(category?: QueryCategory, value?: string) {
    if(category) this.category = category;
    if(value) this.value = value;
  }
}
