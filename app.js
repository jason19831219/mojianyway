var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');

const setting = require('./utils/settings');

var querystring = require('querystring');


var index = require('./routes/index');
var admin = require('./routes/admin');

const api = require("./server/router/api");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', index);
app.use('/admin', admin);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




var cors = require('cors');
app.use(cors);




var server = app.listen(setting.serverPort, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});

// var data = {
//     client_id: '4c38bc060d7fab958aacff502e3e0e7a8464aaebfc816dd5a0f9ead210403c07'
// }
//
// var content = querystring.stringify(data);
//
// var options = {
//     hostname: 'dribbble.com',
//     path: '/oauth/authorize'+ content,
//     method: 'GET'
//
// };
//
// var req = https.request(options, function(res) {
//     console.log("statusCode: ", res.statusCode);
//     console.log("headers: ", res.headers);
//
//     res.on('data', function(d) {
//         process.stdout.write(d);
//     });
// });
// req.end();
//
// req.on('error', function(e) {
//     console.error(e);
// });


module.exports = app;
