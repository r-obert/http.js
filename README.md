### tinyhttp

[Repository](https://gitlab.com/0xAB/tinyhttp)

Provides a promise-based API around XMLHTTPRequest. The code is simple and easy to understand,
and the feature set has most(all?) use-cases covered:

* Supports making requests using all available HTTP methods

* Supports adding HTTP header(s) to a request

* Supports adding request body to a request

* Supports timing out requests who exceed X milliseconds before returning a response.

* Supports creating an escaped query string from an Object, eg: `tinyhttp().get("/foo", {params: {bar: 1}})`.

* **tiny**-ish: dist/tinyhttp.min.js, which is transpiled ES5, adds `window.tinyhttp`, and is intended for use by websites,
  is 2,194 bytes. HTTP-level compression may reduce this further. If you are trying to phase out a bigger library like
  jQuery or similar for smaller parts, then 2KB might not be much in comparison.

* **zero** dependencies: XMLHttpRequest and Promise, the two main dependencies, are both
  provided by the browser.

* Low-level abstraction that seeks to extend XMLHTTPRequest rather than
  replace it with an abstraction (The then() and catch() callbacks are always
  passed an instance of XMLHTTPRequest).

* Written in ES6.. Not sure if that's a feature, but nice for contributing.

Similar to the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
which you should check out before considering this library, since Fetch is most likely
going to be adopted by all major browsers in the future. It's already available in Chrome, and
[many polyfills are available](https://github.com/search?utf8=%E2%9C%93&q=fetch+polyfill&type=)
to choose from.

### Usage

Create an object by calling the `tinyhttp()` function, optionally providing a scheme, hostname
and port in the pattern of `https://localhost:2020`.

The returned object has methods for making requests: "get", "head", "put", and "post".
If there isn't a corresponding method for the HTTP method you want to use, try
to use `request()` instead, eg: `http().request('PATCH', ...)`.

All responses with a status other than 2XX are considered an error, and trigger
the "catch" callback. The request being aborted, timed out, and encountering a
network error(which includes cross-origin errors) all also trigger the "catch"
callback.

__Examples__

> Note: These examples are written with the assumption browserify, webpack or another module
> bundler is being used. If you are using `tinyhttp.min.js` with a &lt;script&gt; tag, then
> `window.tinyhttp()` will be available. Everything else still applies.

In all of the examples where "xhr" is used, it is a reference to an **instance**
of [XMLHTTPRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest),
which is extended to include a `tinyhttp` (xhr.tinyhttp) property that expands its
feature set a little bit.

Most of the time, you will probably be interacting with XMLHTTPRequest directly.
The MDN docs are a good reference see how to read a response body, headers, and more.

There's a [live jsfiddle](https://jsfiddle.net/s9n4ubc1/5/) to try, too, but because of
Cross-Origin restrictions what you can try on jsfiddle may be limited.

__1.__

```js
import tinyhttp from "tinyhttp"
const onOK = (xhr) => console.log(xhr),
      onError = (xhr) => console.log(xhr),
      headers = {'X-Token': 'token1234'}
tinyhttp('https://localhost').get('/greet', {headers}).then(onOK).catch(onError)
```

__2.__

```js
import tinyhttp from "tinyhttp"
const onOK = (xhr) => console.log(xhr),
      onError = (xhr) => console.log(xhr)
tinyhttp('https://localhost').post('/message', {body: "Hi!"}).then(onOK).catch(onError)
```

__3.__

The 'params' object can be passed as an object to attach a properly escaped query string
to the end of a path. In the below example, the request becomes a GET to `/search?q=knock%20knock`.

```js
import tinyhttp from "tinyhttp"
tinyhttp("https://localhost").get("/search", {params: {q: "knock knock"}})
```

__4.__

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

__5.__

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
const http1 = tinyhttp("https://localhost", {timeout: 1000}),
      http2 = tinyhttp("https://www.google.com", {timeout: 2000})

http1.get(..)
http2.get(..)
```

The above also applies for the 'headers', 'params', and 'body' options.

### License

[MIT](./LICENSE.txt)
