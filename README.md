# http-client.js

* <a href='#introduction'>Introduction</a>
* <a href='#features'>Features</a>
* <a href='#examples'>Examples</a>
* <a href='#install'>Install</a>
* <a href='#license'>License</a>

## <a id='introduction'>Introduction</a>

A light promise-based abstraction around `XMLHttpRequest`.  

## <a id='features'>Features</a>

* Supports making requests with the `HEAD`, `GET`, `POST`, `PUT`,  and `PATCH` verbs.

* Supports adding HTTP header(s) to a request.

* Supports adding a request body.

* Supports request time outs.

* Supports providing query parameters as an object literal.

* **light**: `dist/http-client.min.js` is transpiled ES5 - it is minified and weighs 1.2kb.   

## <a id='examples'>Examples</a>

**1.**

This example makes a GET request to `/blog.json?id=10` with the Accept header 
set to `application/json`.

```javascript
import httpclient from 'http-client.js';
new httpclient()
    .get('/blog.json', {params: {id: 10}, headers: {'Accept': 'application/json'}})
    .then((xhr) => JSON.parse(xhr.responseText))
    .catch((xhr) => console.log(xhr));
```

**2.**

The cause of request failure can be found at `xhr.httpclient.cause` and it
returns one of the following strings: `abort`, `timeout`, `error`, `status`:

```javascript
import httpclient from 'http-client.js';
new httpclient().get('/index.html').catch((xhr) => {
  switch(xhr.httpclient.cause) {
  case 'abort':
    return console.log('request aborted')
  case 'timeout':
    return console.log('request timed out')
  case 'error':
    return console.log('network error (including cross-origin errors)')
  case 'status':
    return console.log(`response status code is ${xhr.status}, not 2XX`)
  default:
    throw new Error("Shouldn't happen");
  }
});
```

**3.**

A `httpclient` object can operate under a timeout (measured in ms)
by providing a `timeout` option:

```javascript
import httpclient from 'http-client.js';
const client = new httpclient({timeout: 1000});
client.get('/index.html').then(..).catch(..);
client.get('/projects.html').then(..).catch(..);
```

The timeout can be overridden on a per-request basis by passing a
timeout option to a verb method such as `get`:

```javascript
import httpclient from 'http-client.js';
const client = new httpclient({timeout: 500});
client.get('/index.html').then(..).catch(..);
client.get('/projects.html', {timeout: 5000}).then(..).catch(..);
```

**4.**

In environments where you can make cross-origin requests you can set 
the `baseURI` when creating a new client:

```javascript
import httpclient from 'http-client.js';
const client = new httpclient({baseURI: 'https://www.twitter.com'});
client.get(...);
```

## <a id='install'>Install</a>

__NPM environment__

If you're in a NPM environment, there's an NPM package to use. The package should be required 
or imported as `@rg-3/http-client.js`. http-client.js is implemented as an ES6 module, 
you might need to use babel in order to use it in a node environment.

    # npm users
    $ npm i --save @rg-3/http-client.js

    # yarn users
    $ yarn add @rg-3/http-client.js

__Old school method__

If you're in a browser environment without NPM, you can save [dist/http-client.min.js](https://github.com/rg-3/http-client.js/blob/master/dist/http-client.min.js) to your project and link to it from a `<script>` tag. It has been transpiled to ES5,
and adds `window.httpclient`.

## Contribute

Install dependencies with [yarn](https://yarnpkg.com).

    $ yarn

Run the tests:

    $ yarn test

Build dist/http-client.min.js:

    $ yarn distbuild

## <a id='license'>License</a>

This project uses the MIT license, see [LICENSE.txt](./LICENSE.txt) for details.
