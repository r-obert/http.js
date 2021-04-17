const encode = (str) => {
  return encodeURIComponent(decodeURIComponent(str));
};

const createQueryString = (params) => {
  if (Object.keys(params || {}).length > 0) {
    let query = [];
    for (let key in params) {
      query.push(`${encode(key)}=${encode(params[key])}`);
    }
    return '?' + query.join('&');
  }
  return '';
};

const PromiseRequest = (httpMethod, host, path, options) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const { headers, timeout, params, body } = options;
    xhr.httpclient = Object.create(null);
    xhr.open(httpMethod, `${host}${path}${createQueryString(params)}`, true);
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    xhr.timeout = timeout;
    xhr.addEventListener('abort'  , () => { xhr.httpclient.cause = 'abort';   reject(xhr) });
    xhr.addEventListener('timeout', () => { xhr.httpclient.cause = 'timeout'; reject(xhr) });
    xhr.addEventListener('error'  , () => { xhr.httpclient.cause = 'error';   reject(xhr) });
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState !== xhr.DONE || xhr.status === 0) {
        return;
      }
      if (/^2\d{2}$/.test(String(xhr.status))) {
        resolve(xhr)
      } else {
        xhr.httpclient.cause = 'status';
        reject(xhr);
      };
    });
    xhr.send(body);
  });
};

const httpclient = function(host = '', defaultOptions = {}) {
  this.head  = (path, options = {}) => this.request('HEAD', path, options);
  this.get   = (path, options = {}) => this.request('GET', path, options);
  this.post  = (path, options = {}) => this.request('POST', path, options);
  this.put   = (path, options = {}) => this.request('PUT', path, options);
  this.patch = (path, options = {}) => this.request('PATCH', path, options);

  this.request = (httpMethod, path, options = {}) => {
    options = Object.assign({}, defaultOptions, options)
    return PromiseRequest(httpMethod, host, path, options)
  };

  return this;
};

module.exports = httpclient;
module.exports.default = httpclient;
