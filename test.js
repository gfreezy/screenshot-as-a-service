var weibo = require('weibo');
var connect = require('connect');
/**
 * init weibo api settings
 */

weibo.init('weibo', '1753603767', '51eccdf6f40be550bcbe3aecd55e0ac8');

/**
 * Create a web application.
 */
var app = connect(
  connect.query(),
  connect.cookieParser('oh year a cookie secret'),
  connect.session({ secret: "oh year a secret" }),
  // using weibo.oauth middleware for use login
  // will auto save user in req.session.oauthUser
  weibo.oauth({
    loginPath: '/login',
    logoutPath: '/logout',
    blogtypeField: 'type',
    afterLogin: function (req, res, callback) {
      console.log(req.session.oauthUser.screen_name, 'login success');
      process.nextTick(callback);
    },
    beforeLogout: function (req, res, callback) {
      console.log(req.session.oauthUser.screen_name, 'loging out');
      process.nextTick(callback);
    }
  }),
  connect.errorHandler({ stack: true, dump: true })
);

app.use('/', function (req, res, next) {
  var user = req.session.oauthUser;
  res.writeHeader(200, { 'Content-Type': 'text/html' });
  if (!user) {
    res.end('Login with <a href="/login?type=weibo">Weibo</a> | \
      <a href="/login?type=tqq">QQ</a> | \
      <a href="/login?type=github">Github</a>');
    return;
  }
  res.end('Hello, <img src="' + user.profile_image_url + '" />\
    <a href="' + user.t_url +
    '" target="_blank">@' + user.screen_name + '</a>. ' +
    '<a href="/logout">Logout</a>'+
    'access_token'+user.access_token);
});


app.listen(80);
console.log('Server start on http://localhost/');
