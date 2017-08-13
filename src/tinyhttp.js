const encode = (str) => {
  const _encode = encodeURIComponent,
        decode  = decodeURIComponent
  return _encode(decode(str))
}

const createQuery = (params) => {
  if(Object.keys(params || {}).length > 0) {
    let query = []
    for(let key in params)
      query.push(`${encode(key)}=${encode(params[key])}`)
    return "?" + query.join("&")
  }
  return ""
}

const PromiseRequest = (httpMethod, host, path, options) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest(),
          {headers, timeout, params, body} = options,
          fail = (cause) => {
            xhr.tinyhttp.cause = cause
            reject(xhr)
          }
    xhr.tinyhttp = Object.create(null)
    xhr.open(httpMethod, `${host}${path}${createQuery(params)}`, true)
    for(let key in headers)
      xhr.setRequestHeader(key, headers[key])
    xhr.timeout = timeout
    xhr.addEventListener('abort', () => fail("abort"))
    xhr.addEventListener('timeout', () => fail("timeout"))
    xhr.addEventListener('error', () => fail("error"))
    xhr.addEventListener('readystatechange', () => {
      if(xhr.readyState === xhr.DONE && xhr.status > 0)
        (/^2\d{2}$/.test(String(xhr.status))) ? resolve(xhr) : fail("status")
    })
    xhr.send(body)
  })
}

export default function(host="", defaultOptions={}) {
  const self = Object.create(null)

  self.head = (path, options={}) => self.request("HEAD", path, options)
  self.get  = (path, options={}) => self.request("GET", path, options)
  self.post = (path, options={}) => self.request("POST", path, options)
  self.put  = (path, options={}) => self.request("PUT", path, options)

  self.request = (httpMethod, path, options={}) => {
    options = Object.assign({}, defaultOptions, options)
    return PromiseRequest(httpMethod, host, path, options)
  }

  return self
}
