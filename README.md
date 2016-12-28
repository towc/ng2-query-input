# Angular 2 Query-Input

This project provides text-inputs for custom search queries. A query can have multiple arguments with each having a
"search-category" and an assigned value. Queries have the following syntax:

  ```
  <CategoryName1>: <Value1> <CategoryName2>: <Value2>
  ```

## Installation
Install via [npm](https://www.npmjs.com/search?q=ng2-table) package manager using the following command:

  ```bash
  npm install ng2-query-input --save
  ```

Add it to your module by importing it and adding it to the import-section

  ```typescript
  import { QueryInputModule } from 'ng2-query-input/ng2-query-input';
  ```

  ```typescript
  @NgModule({
    declarations: [
      ...
    ],
    imports: [
      ...,
      QueryInputModule
    ]
  })
  export class ... { }

  ```

## Usage

Documentation still left to do. Have a look at the example implementation in [/src/example-app/](https://github.com/fabianscheidt/ng2-query-input/tree/master/src/example-app)

## License

The MIT License (see the [LICENSE](https://github.com/fabianscheidt/ng2-query-input/blob/master/LICENSE) file for the full text)
