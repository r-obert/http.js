export default function(options) {
  const self = Object.create(null),
        host = {options}

  self.get = (path, options={}) => self.request("GET", path, options)
  self.post = (path, options={}) => self.request("POST", path, options)

  self.request = (httpMethod, path, options) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest(),
            {headers, timeout, body} = options
      xhr.open(httpMethod, `${host}${path}`, true)
      for(const headerKey in headers)
        xhr.setRequestHeader(headerKey, headers[headerKey])
      xhr.timeout = timeout
      xhr.addEventListener('abort', reject)
      xhr.addEventListener('timeout', reject)
      xhr.addEventListener('error',   reject)
      xhr.addEventListener('readystatechange', () => {
        if(xhr.readyState === 4 && xhr.status > 0)
          (String(xhr.status).test(/^2\d{2}$/)) ? resolve(xhr) : reject(xhr)
      })
      xhr.send(body)
    })
  }

  return self
}
