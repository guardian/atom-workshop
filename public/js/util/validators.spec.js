import { isHttpsUrl } from './validators';


describe("isHttpsUrl function", () => {

  it('Should validate a simple URL as an HTTPS URL', () => {
    let url = 'https://example.com';

    isHttpsUrl(url)
      .then(res => {
        expect(res).toBe(true);
      });
  });

  it('Should validate a complex URL as an HTTPS URL', () => {
    let url = 'https://example.co.uk/broken/test(1).mp3';

    isHttpsUrl(url)
      .then(res => {
        expect(res).toBe(true);
      });
  });

  it('Should reject an invalid URL', () => {
    let url = 'wrong';

    isHttpsUrl(url)
      .then(res => {
        expect(res.title).toBe('not-url');
      });
  });

  it('Should reject an HTTP URL', () => {
    let url = 'http://example.com';

    isHttpsUrl(url)
      .then(res => {
        expect(res.title).toBe('not-https');
      });
  });

});
