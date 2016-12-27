export class QueryCategory {
  name: string;
  description: string;

  constructor(name?: string, description?:string) {
    if(name) this.name = name;
    if(description) this.description = description;
  }
}
