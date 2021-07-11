import HttpClient from '../src/http-client.js';
import mock from 'xhr-mock';

describe('httpclient', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  describe('GET', () => {
    test('a successful GET request to /index.html', (done) => {
      const client = new HttpClient();
      expect.assertions(1);

      mock.get('/index.html', (req, res) => {
        return res.status(200).body('foobar');
      });

      client
        .get('/index.html')
        .then((xhr) => {
          expect(xhr.responseText).toBe('foobar');
          done();
        });
    });

    test('a successful GET request to /index.html?q=foo%20bar', (done) => {
      const client = new HttpClient();
      expect.assertions(1);

      mock.get('/index.html?q=foo%20bar', (req, res) => {
        return res.status(200).body('foobar');
      });

      client
        .get('/index.html', { params: { q: 'foo bar' } })
        .then((xhr) => {
          expect(xhr.responseText).toBe('foobar');
          done();
        });
    });

    test('a successful GET request to /index.html with the Accept header', (done) => {
      const client = new HttpClient();
      expect.assertions(1);

      mock.get('/index.html', (req, res) => {
        const reqHeaders = req.headers();
        expect(reqHeaders.accept).toBe('text/html');
        return res.status(200).body('foobar');
      });

      client
        .get('/index.html', { headers: { accept: 'text/html' } })
        .then(() => done());
    });

    test('an unsuccessful GET request to /index.html', (done) => {
      const client = new HttpClient();
      expect.assertions(1);

      mock.get('/index.html', (req, res) => {
        return res.status(500).body('server error');
      });

      client
        .get('/index.html', { headers: { accept: 'text/html' } })
        .catch((xhr) => {
          expect(xhr.httpclient.cause).toBe('status');
          done();
        });
    });
  });

  describe('POST', () => {
    test('a POST request to /posts', (done) => {
      const client = new HttpClient();
      expect.assertions(2);

      mock.post('/posts', (req, res) => {
        expect(req.body()).toBe(JSON.stringify({ body: 'foobar' }));
        return res.status(200).body(JSON.stringify({ status: 'ok' }));
      });

      client
        .post('/posts', { body: JSON.stringify({ body: 'foobar' }) })
        .then((xhr) => {
          expect(xhr.responseText).toBe(JSON.stringify({ status: 'ok' }));
          done();
        });
    });
  });
});
