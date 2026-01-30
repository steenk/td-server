#!/usr/bin/env node

var ip = /^\d+\.\d+\.\d+\.\d+$/.test(process.argv0) ? process.argv0 : '127.0.0.1';
var root = process.cwd();
var port = process.env.TD_PORT || 3000;

var connect = require('connect')
,   http = require('http')
,   bodyParser = require('body-parser')
,   stat = require('serve-static')
,   qs = require('qs')
,   favicon = require('serve-favicon')
,   url = require('url')
,   morgan = require('morgan');

var app = connect()
  .use(morgan(':date :method :url :status'))
  .use(favicon(__dirname + '/../images/favicon.ico'))
  .use((req, res, next) => {
    const queryString = req.url.split('?')[1];
    Object.defineProperty(req, 'query', {
      value: qs.parse(queryString),
      writable: true,
      enumerable: true,
      configurable: true 
    });
    next();})
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

var server = http.createServer(app).listen(port, ip);

