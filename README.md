# http-client.js

* <a href='#introduction'>Introduction</a>
* <a href='#features'>Features</a>
* <a href='#examples'>Examples</a>
* <a href='#install'>Install</a>
* <a href='#license'>License</a>

## <a id='introduction'>Introduction</a>

A promise-based API around `XMLHttpRequest`.  

## <a id='features'>Features</a>

* Supports making requests using all available HTTP methods.

* Supports adding HTTP header(s) to a request.

* Supports adding a request body.

* Supports request time outs.

* Supports escaped query strings derived from an Object, eg:
  `httpClient().get('/search', {params: {q: 'hello world'}})`.

* **lightweight**: `dist/http-client.min.js`, which is transpiled to ES5,
  adds `window.HttpClient`, and is intended for use by websites who have
  to support old browsers is only 2kb~ (uncompressed).

* **zero** external dependencies: `Promise` and `XMLHTTPRequest` are the only
  dependencies, both are implemented and provided by the browser.

## window.fetch or http-client.js ?

Probably `window.fetch` !

This library was written before it existed, and for most cases it's the better
option because it is built into the browser. If you're curious about an
alternative `XMLHttpRequest` API though, read on.

## <a id='examples'>Examples</a>

__1.__

`https://localhost` is an optional argument that will default to the protocol and
host of the current window, and the headers argument is also optional.

```javascript
import HttpClient from 'http-client';
const headers = {'X-Token': 'token1234'};
HttpClient('https://localhost')
  .get('/greet', {headers})
  .then((xhr) => console.log(xhr))
  .catch((xhr) => console.log(xhr));
```

__2.__

URL query parameters can be passed as an Object:

```javascript
import HttpClient from 'http-client.js';
HttpClient().get('/search', {params: {q: 'knock knock'}});
```

__3.__

The reason a request failed can be found at `xhr.httpClient.cause` and
returns one of the following strings: `abort`, `timeout`, `error`, `status`:

```javascript
HttpClient().get('/index.html').catch((xhr) => {
  switch(xhr.httpClient.cause) {
  case 'abort':
    return console.log('request aborted')
  case 'timeout':
    return console.log('request timed out')
  case 'error':
    return console.log('network error (including cross-origin errors)')
  case 'status':
    return console.log(`response status code is ${xhr.status}, not 2XX`)
  }
}
```

__4.__

All requests to a given domain can operate under a timeout:

```javascript
import HttpClient from 'http-client.js';
const client = HttpClient('https://localhost', {timeout: 1000});
client.get('/index.html').then(...);
client.get('/index2.html').then(...);
```

The timeout can be overridden on a per-request basis by providing
a 'timeout' option when making a request:

```javascript
import HttpClient from 'http-client.js';
const client = HttpClient('', {timeout: 500});
client.get('/fastpage').then(..)
client.get('/veryslowpage', {timeout: 5000}).then(..)
```

Two different HttpClient objects can have unrelated timeouts:

```javascript
import HttpClient from 'http-client.js';
const client1 = HttpClient('https://localhost', {timeout: 1000});
const client2 = HttpClient('https://www.google.com', {timeout: 2000});

client1.get(..);
client2.get(..);
```

## <a id='install'>Install</a>

npm:

    $ npm i --save @rg-3/http-client.js

yarn:

    $ yarn add @rg-3/http-client.js

## <a id='license'>License</a>

This project uses the MIT license, see [LICENSE.txt](./LICENSE.txt) for details.
