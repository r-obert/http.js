# tinyhttp.js

* <a href='#introduction'>Introduction</a>
* <a href='#examples'>Examples</a>
* <a href='#install'>Install</a>
* <a href='#license'>License</a>

## <a id='introduction'>Introduction</a>

A promise-based API around `XMLHttpRequest`.  
The feature set should have all use-cases covered:

* Supports making requests using all available HTTP methods.

* Supports adding HTTP header(s) to a request.

* Supports adding a request body.

* Supports request time outs.

* Supports escaped query strings derived from an Object, eg:
  `tinyhttp().get('/search', {params: {q: 'hello world'}})`.

* **tiny**-ish: dist/tinyhttp.min.js, which is trans-piled ES5,
  adds `window.tinyhttp`, and is intended for use by websites who have
  to support old browsers  is only 2kb~ (uncompressed).

* **zero** dependencies: This package does not depend on any other NPM packages
  but a modern browser is expected.  On older browsers, consider adding polyfils
  for the missing APIs.

## window.fetch or tinyhttp.js ?

Probably `window.fetch` !

This library was written before it existed, and for most cases it's the better
option because it is built into the browser. If you're curious about an
alternative `XMLHttpRequest` API though, read on.

## <a id='examples'>Examples</a>

__1.__

The first argument, `https://localhost` is optional and when it's not given
it will default to the host of the current window.

```javascript
import tinyhttp from 'tinyhttp'
const headers = {'X-Token': 'token1234'}
tinyhttp('https://localhost').get('/greet', {headers})
  .then((xhr) => console.log(xhr))
  .catch((xhr) => console.log(xhr))
```

__2.__

A query string can be passed as an Object.
This example makes a GET request to `/search?q=knock%20knock`.

```javascript
import tinyhttp from 'tinyhttp'
tinyhttp().get('/search', {params: {q: 'knock knock'}})
```

__3.__

If you want to find the cause of a request being rejected, `xhr.tinyhttp.cause`
returns one of the following strings: 'abort', 'timeout', 'error', or 'status'.

```javascript
tinyhttp().get('/index.html').catch((xhr) => {
  switch(xhr.tinyhttp.cause) {
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

If you want to impose a timeout on all requests to a
particular domain, then provide a 'timeout' option to
the `tinyhttp` function:

```javascript
import tinyhttp from 'tinyhttp'
const http = tinyhttp('https://localhost', {timeout: 1000})
http.get('/index.html').then(...)
http.get('/index2.html').then(...)
```

The timeout can be over-ridden on a per-request basis by providing
a 'timeout' option to get (or related) functions:

```javascript
import tinyhttp from 'http'
const http = tinyhttp('', {timeout: 500})
http.get('/fastpage').then(..)
http.get('/veryslowpage', {timeout: 5000}).then(..)
```

Two different tinyhttp objects can have unrelated timeouts:

```javascript
import tinyhttp from 'http'
const http1 = tinyhttp('https://localhost', {timeout: 1000})
const http2 = tinyhttp('https://www.google.com', {timeout: 2000})

http1.get(..)
http2.get(..)
```

## <a id='install'>Install</a>

npm:

    $ npm i --save @rg-3/tinyhttp.js

yarn:

    $ yarn add @rg-3/tinyhttp.js

## <a id='license'>License</a>

This project uses the MIT license, see [LICENSE.txt](./LICENSE.txt) for details.
