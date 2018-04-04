var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');

const settings = require("../utils/settings");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Anyway Application One'});
});

router.get('/oauth', function (req, res, next) {
    // Request methods you wish to allow


    var auth_code = req.query.code;
    console.log(auth_code);


    var post_data = {
        client_id: settings.dribbble_client_id,
        client_secret : settings.dribbble_client_secret,
        code: auth_code
    };

    var postData = querystring.stringify(post_data);
    console.log("post_data"+post_data);
    console.log("content"+postData);

    var value = postData.length;

    var options = {
        hostname: 'dribbble.com',
        path: '/oauth/token',
        method: 'POST'
    };

    var request = https.request(options, function(response){

        response.setEncoding('utf8');

        var body = '';


        response.on('data', function(data) {
            var jsonResponse = JSON.parse(data);
            settings.dribbble_client_admin_token = jsonResponse.access_token;
            console.log(`响应主体:`+settings.dribbble_client_admin_token);
        });

        response.on('end', function() {
            console.log('响应中已无数据。');
        });
    });

    request.on('error', function(e) {
        console.log(e.message);
        // deferred.reject();
    });
    // req.write(post_data);
    request.write(postData);
    request.end();



});




router.route("/register").get(function (req, res) {    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register", {title: 'User register'});
});


module.exports = router;
