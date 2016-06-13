
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8080/'
});

var proxyMiddlewareServer = function (req, res, next) {
    debugger;
    console.log('Redirecting to 8080');
  if (req.url.indexOf('api') != -1) {
    proxy.web(req, res);
  } else {
    next();
  }
};

var middleware = {
  serve: proxyMiddlewareServer
}

module.exports = middleware;