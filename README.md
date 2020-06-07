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

* **zero** external dependencies: `Promise` and `XMLHTTPRequest`, the only
  two dependencies, are implemented and provided by the browser.

## window.fetch or http-client.js ?

Probably `window.fetch`.

This library was written before it existed, and for most cases it's the better
option because it is built into the browser. If you're curious about an
alternative API built on `XMLHttpRequest` and Promise's though, read on.

## <a id='examples'>Examples</a>

__1.__

The following example makes a GET request to `/intro`.

```javascript
import HttpClient from 'http-client.js';
new HttpClient()
    .get('/intro')
    .then((xhr) => console.log(xhr))
    .catch((xhr) => console.log(xhr));
```

__2.__

The following example demonstrates how to use the `params` option, it can be
used to pass query string parameters with a request.

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient();
client.get('/search',{params: {q: 'query'}}).then(..).catch(..);
```

__3.__

The following examples demonstrates how to use the `headers` option, it can be
used to send headers with a request.

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient();
client.get('/search', {headers: {'X-Query': 'query'}}).then(..).catch(..);
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
});
```

__5.__

All requests to a given domain can operate under a timeout, the following example
passes the protocol and host of the current window as the first argument and
a timeout option as the second argument. The timeout is understood to be in
milliseconds.

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient(location.origin, {timeout: 1000});
client.get('/page1.html').then(..).catch(..);
client.get('/page2.html').then(..).catch(..);
```

The timeout can be overridden on a per-request basis by passing a timeout option
to a verb method such as `get`.

```javascript
import HttpClient from 'http-client.js';
const client = new HttpClient(location.origin, {timeout: 500});
client.get('/fastpage').then(..).catch(..);
client.get('/slowpage', {timeout: 5000}).then(..).catch(..);
```

## <a id='install'>Install</a>

__NPM environment__

If you're in a NPM environment, either one of the following commands should work.
Note that `require` or `import` should use `@rg-3/http-client.js` instead of just
`http-client.js` like the examples have shown.

    # npm users
    $ npm i --save @rg-3/http-client.js

    # yarn users
    $ yarn add @rg-3/http-client.js

__Old school method__

If you're in a browser environment without NPM, you can save [dist/http-client.min.js](https://github.com/rg-3/http-client.js/blob/master/dist/http-client.min.js)
to your project and link to it from a `<script>` tag. It has been transpiled to ES5,
and adds `window.HttpClient`.


## <a id='license'>License</a>

This project uses the MIT license, see [LICENSE.txt](./LICENSE.txt) for details.
