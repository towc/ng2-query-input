import { Ng2QueryInputPage } from './app.po';

describe('ng2-query-input App', function() {
  let page: Ng2QueryInputPage;

  beforeEach(() => {
    page = new Ng2QueryInputPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
