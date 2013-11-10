var express = require('express');
var weibo = require('weibo');

/**
 * init weibo api settings
 */

weibo.init('weibo', '1753603767', '51eccdf6f40be550bcbe3aecd55e0ac8');

/**
 * Create a web application.
 */
app = express();
app.get('/', function (req, res, next) {
  // var user = req.session.oauthUser;
  var user = {access_token: '2.00R3JhACj8wfuB4beefb80dd3uaClB',blogtype: 'weibo'}

  res.writeHeader(200, { 'Content-Type': 'text/html' });
  if (!user) {
    res.end('Login with <a href="/login?type=weibo">Weibo</a>');
    return;
  }
  res.end('Hello, <img src="' + user.profile_image_url + '" />\
    <a href="' + user.t_url +
    '" target="_blank">@' + user.screen_name + '</a>. ' +
    '<a href="/logout">Logout</a>');
});

app.post('/upload', function(req, res, next) {
  res.writeHeader(200, { 'Content-Type': 'image/png'});
  var user = {access_token: '2.00R3JhACj8wfuB4beefb80dd3uaClB',blogtype: 'weibo'}

  var img = '';
  req.setEncoding('binary');
  req.on('data', function(chunk) {
    img += chunk;
  })
  req.on('end', function() {
    weibo.upload(user, 'test', {
        data: new Buffer(img, 'binary'),
        name: 'a.png',
        content_type: 'image/png'}, function(error, status) {
      if (error) {
        console.error(error);
        return;
      }
      console.dir(status);
    });
  });

});


app.listen(80);
console.log('Server start on http://localhost/');
