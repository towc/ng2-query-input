import {QueryPart} from "./query-part";

export class Query {
  parts: Array<QueryPart>;

  constructor(parts?: Array<QueryPart>) {
    if(parts) this.parts = parts;
  }
}
