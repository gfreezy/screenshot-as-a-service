/**
 * Module dependencies.
 */
var config = require('config');
var express = require('express');
var RasterizerService = require('./lib/rasterizerService');
var FileCleanerService = require('./lib/fileCleanerService');
var weibo = require('weibo');

process.on('uncaughtException', function (err) {
  console.error("[uncaughtException]", err);
  process.exit(1);
});

process.on('SIGTERM', function () {
  process.exit(0);
});

process.on('SIGINT', function () {
  process.exit(0);
});

// web service
var app = express();
app.configure(function(){
  weibo.init('weibo', config.weibo.app_key, config.weibo.app_sign);
  var user = {access_token: config.weibo.access_token, blogtype: 'weibo'}

  app.use(express.static(__dirname + '/public'))
  app.use(app.router);
  app.set('rasterizerService', new RasterizerService(config.rasterizer).startService());
  app.set('fileCleanerService', new FileCleanerService(config.cache.lifetime));
  app.set('user', user);
  app.set('weibo', weibo);
});
app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
require('./routes')(app, config.server.useCors);
app.listen(config.server.port);
console.log('Express server listening on port ' + config.server.port);
