import { CloudNotationPage } from './app.po';

describe('cloud-notation App', function() {
  let page: CloudNotationPage;

  beforeEach(() => {
    page = new CloudNotationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
