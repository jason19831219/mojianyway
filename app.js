var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const fs = require("fs");
const resolve = file => path.resolve(__dirname, file);
const session = require("express-session");
const RedisStore =require("connect-redis")(session);


const settings = require("./utils/settings");


const api = require("./server/router/api");
const manage = require("./server/router/manage");

var app = express();

// view engine setup
//
// app.set("views", path.join(__dirname, settings.frontend_path));
// app.engine(".html", require("ejs").__express);
app.set("view engine", "ejs");


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(settings.encrypt_key));
let sessionConfig = {
	name: settings.auth_cookie_name,
	secret: settings.encrypt_key,
	cookie: {
		secure: false,
		maxAge: 60 * 60 * 1000,
	},
	resave: true,
	saveUninitialized: true,

	store: new RedisStore({
		port: settings.redis_port,
		host: settings.redis_host,
		pass: settings.redis_psd,
		ttl: 1800 // 过期时间
	})
	// resave: false,
	// saveUninitialized: true,
	// store: new MongoStore({
	//   db: "session",
	//   host: "localhost",
	//   port: 27017,
	//   url: "mongodb://" + settings.mongo_username + ":" + settings.mongo_password + "@" + settings.mongo_host + ":" + settings.mongo_port + "/" + settings.mongo_db + ""
	// })
};




app.use(session(sessionConfig));



// app.use('/', index);
// app.use('/manage', manage);
// app.use('/api', api);
// app.use('/static', express.static(resolve('../mojiclient/dist/static')))
// app.get('*', function (request, response) {
//   fs.readFile("../mojiclient/dist/index.html",function(err,data){
//     // body
//     if(err){
//       console.log(err);
//       response.writeHead(404,{"Content-Type":"text/html"});
//     }
//     else{
//       //200：OK
//       response.writeHead(200,{"Content-Type":"text/html"});
//       response.write(data.toString());
//     }
//     response.end();
//   });
// })
//

app.use("/public", express.static(resolve("public")));
app.use(express.static(path.join(__dirname, settings.frontend_path)));
app.use("/api", api);
app.use("/manage", manage);
// app.get('/', function(req, res, next) {
//
//   res.cookie(settings.auth_cookie_name, "sdfsdfs",
//     { path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true });
//
//
// });



// app.get('/session', function (req, res) {
//   if (req.session.sign) {//检查用户是否已经登录
//     console.log(req.session);//打印session的值
//     res.send('welecome <strong>' + req.session.name + '</strong>, 欢迎你再次登录');
//   } else {
//
//     console.log(req.session);
//     req.session.sign = true;
//     req.session.name = 'https://github.com/CleverFan';
//     res.send('欢迎登陆！');
//   }
// });

app.get("*", function(req, res) {
	const html = fs.readFileSync(path.resolve(__dirname, settings.frontend_path+"/index.html"), "utf-8");
	res.send(html);
});

// app.all("*", function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", req.headers.origin);
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
// 	res.header("Access-Control-Allow-Credentials", true);
// 	res.header("X-Powered-By"," 3.2.1");
// 	res.header("Content-Type", "application/json;charset=utf-8");
// 	next();
// });
// app.use(express.static(path.join(__dirname, settings.frontend_path)));
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
//
// });







var server = app.listen(settings.serverPort, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log("应用实例，访问地址为 http://%s:%s", host, port);

});



module.exports = app;
