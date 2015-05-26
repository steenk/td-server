#!/usr/bin/env node

var root = process.cwd();
var port = process.env.TD_PORT || 3000;

console.log();
console.log('HTTP server started with PID', process.pid, 'and port', port, 'and root', root);
console.log('Use command "td -k" to stop it.');
console.log();

var connect = require('connect')
,   http = require('http')
,	bodyParser = require('body-parser')
,   stat = require('serve-static')
,	queries = require('connect-query')
,	favicon = require('serve-favicon')
,	proxy = require('proxy-middleware')
,	url = require('url')
,   morgan = require('morgan');

var app = connect()
  .use(morgan(':date :method :url :status'))
  .use(favicon(__dirname + '/../images/favicon.ico'))
  .use(queries())
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(function (req, res, next) {
	  if (req.url === '/exit') {
		res.end();
		process.exit();
	  } if (req.url === '/status') {
		res.write('Running on port ' + port + ' with root ' + root + '\n');
		res.end();
	  } else {
		next();
	  }
   })
  .use(stat(root));

if (process.env.TD_PROXY) {
	console.log('PROXY', process.env.TD_PROXY);
	var opts = url.parse(process.env.TD_PROXY);
	opts.cookieRewrite = true;
	opts.headers = {origin: 'http://klickonom.se'};
	app.use('/proxy', proxy(opts));
}

var server = http.createServer(app).listen(port, "127.0.0.1");
