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
  `new HttpClient().get('/search', {params: {q: 'hello world'}})`.

* **light**: `dist/http-client.min.js`, which is transpiled ES5, weighs around 2.3kb.

* **zero** outside dependencies: `Promise` and `XMLHTTPRequest`, the only
  two dependencies, are implemented and provided by the browser.

## window.fetch or http-client.js ?

Probably `window.fetch`.

This library was written before it existed, and for most cases it's the better
option because it is built into the browser. If you're curious about an
alternative API built on `XMLHttpRequest` though, read on.

## <a id='examples'>Examples</a>

__1.__

This example makes a GET request to `https://foobar.com/greet`.

`https://foobar.com` is an optional argument that will default to the protocol
and host of the current window.

```javascript
import HttpClient from 'http-client.js';
new HttpClient('https://foobar.com')
    .get('/greet')
    .then((xhr) => console.log(xhr))
    .catch((xhr) => console.log(xhr));
```

__2.__

The `params` option can be used to pass query string parameters with the request,
in this case the request will be made to `/search?q=knock%20knock`:

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient();
client.get('/search',{params: {q: 'knock knock'}}).then(..).catch(..);
```

__3.__

The `headers` option can be used to send headers with the request:

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient();
client.get('/search', {headers: {'X-Query': 'foobar'}}).then(..).catch(..);
```

__4.__

The reason a request failed can be found at `xhr.httpClient.cause` and it
returns one of the following strings: `abort`, `timeout`, `error`, `status`:

```javascript
new HttpClient().get('/index.html').catch((xhr) => {
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

__5.__

All requests to a given domain can operate under a timeout:

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient(location.origin, {timeout: 1000});
client.get('/index.html').then(..).catch(..);
client.get('/index2.html').then(..).catch(..);
```

The timeout can be overridden or applied on a per-request basis by providing
a 'timeout' option to a verb method such as `get()`:

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient(location.origin, {timeout: 500});
client.get('/fastpage').then(..).catch(..)
client.get('/veryslowpage', {timeout: 5000}).then(..).catch(..)
```

## <a id='install'>Install</a>

If in a NPM or Yarn environment, either one of these should work:

    $ npm i --save @rg-3/http-client.js
    $ yarn add @rg-3/http-client.js

If you're in a browser environment without NPM or Yarn, you can save [dist/http-client.min.js](https://github.com/rg-3/http-client.js/blob/master/dist/http-client.min.js)
to your project and link to it from a `<script>` tag. It has been transpiled to ES5,
and adds `window.HttpClient`.


## <a id='license'>License</a>

This project uses the MIT license, see [LICENSE.txt](./LICENSE.txt) for details.
