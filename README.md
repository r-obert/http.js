# tinyhttp.js

**DEPRECATED: Modern browsers ship with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), check it out first.**

Provides a promise-based API around XMLHTTPRequest. The code is short and sweet,
and the feature set should have all use-cases covered:

* Supports making requests using all available HTTP methods.

* Supports adding HTTP header(s) to a request.

* Supports adding request body to a request.

* Supports timing out a requests after X ms.

* Supports creating an escaped query string from an Object, eg:
  `tinyhttp().get("/foo", {params: {bar: 1}})`.

* **tiny**-ish: dist/tinyhttp.min.js, which is transpiled ES5, adds `window.tinyhttp`, and is intended for use by websites,
  is 2,194 bytes. HTTP-level compression may reduce this further. If you are trying to phase out a bigger library like
  jQuery or build upon smaller parts, then 2KB could be good enough.

* **zero** dependencies: All APIs should be provided by any modern browser,
  no external dependencies.

## Usage

Create an object by calling the `tinyhttp()` function, optionally providing a scheme, hostname
and port in the pattern of `https://localhost:2020`.

The returned object has methods for making requests: "get", "head", "put", and "post".
If there isn't a corresponding method for the HTTP method you want to use, try
to use `request()` instead, eg: `http().request('PATCH', ...)`.

All responses with a status other than 2XX are considered an error, and trigger
the "catch" callback. The request being aborted, timed out, and encountering a
network error(which includes cross-origin errors) all also trigger the "catch"
callback.

## Examples

> Note: These examples are written with the assumption browserify, webpack or another module
> bundler is being used. If you are using `tinyhttp.min.js` with a &lt;script&gt; tag, then
> `window.tinyhttp()` will be available. Everything else still applies.

__1.__

```js
import tinyhttp from 'tinyhttp'
const headers = {'X-Token': 'token1234'}
tinyhttp('https://localhost').get('/greet', {headers})
  .then((xhr) => console.log(xhr))
  .catch((xhr) => console.log(xhr))
```

__2.__

The 'params' object can be passed as an object to attach a properly escaped query string
to the end of a path. In the below example, the request becomes a GET to `/search?q=knock%20knock`.
The 'body' option can be used to set a request body.

```js
import tinyhttp from "tinyhttp"
tinyhttp("https://localhost").post("/search", {body: "foobar", params: {q: "knock knock"}})
```

__3.__

When you want to find the cause of a request being rejected, `xhr.tinyhttp.cause`
returns one of the following strings: "abort", "timeout", "error", or "status".

`xhr.tinyhttp` is an Object, that is attached to "xhr" (an instance of XMLHTTPRequest) after
receiving an unsuccessful response(status) or encountering an error that prevented a
response from being received (abort, timeout, error).

```js
tinyhttp("https://localhost").get("/404", {timeout: 1000}).catch((xhr) => {
  switch(xhr.tinyhttp.cause) {
  case "abort":
    return console.log("request aborted!")
  case "timeout":
    return console.log("request timed out!")
  case "error":
    return console.log("network error (including cross-origin errors)")
  case "status":
    return console.log(`response status code is ${xhr.status}, not 2XX!`)
  }
}
```

__4.__

When you want to impose a timeout on all requests to a particular domain, you can provide a
'timeout' option to the `tinyhttp` function:

```js
import tinyhttp from "tinyhttp"
const http = tinyhttp("https://localhost", {timeout: 1000})
http.get("/index.html").then(...)
http.get("/index2.html").then(...)
```

The timeout can be overriden on a per-request basis by providing a 'timeout' option
to the get(& related) functions:

```js
import tinyhttp from "http"
const http = tinyhttp("https://localhost", {timeout: 500})
http.get("/fastpage").then(..)
http.get("/veryslowpage", {timeout: 5000}).then(..)
```

Two different tinyhttp objects can have unrelated timeouts:

```js
import tinyhttp from "http"
const http1 = tinyhttp("https://localhost", {timeout: 1000})
const http2 = tinyhttp("https://www.google.com", {timeout: 2000})

http1.get(..)
http2.get(..)
```

The above also applies for the 'headers', 'params', and 'body' options.

## Real world usage

tinyhttp.js is used by the Private Internet Access browser extensions
(last checked version: v1.7.0), see this [link](https://github.com/pia-foss/extension-chrome/blob/7530fb78ca23aff8f5874f740cbb4dc4af8cacef/package.json#L49).


## License

[MIT](./LICENSE.txt)
