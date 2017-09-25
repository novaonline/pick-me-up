import { PickMeUpPage } from './app.po';

describe('pick-me-up App', () => {
  let page: PickMeUpPage;

  beforeEach(() => {
    page = new PickMeUpPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
