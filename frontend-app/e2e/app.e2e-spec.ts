import { FrontendAppPage } from './app.po';

describe('frontend-app App', function() {
  let page: FrontendAppPage;

  beforeEach(() => {
    page = new FrontendAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
