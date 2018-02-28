var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');


var cheeerio = require('cheerio');
const settings = require("../utils/settings");


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/shots', function (req, res, next) {
    // Request methods you wish to allow


    // var auth_code = req.query.code;
    console.log('token' + settings.dribbble_client_admin_token);


    var options = {
        hostname: 'api.dribbble.com',
        path: '/v2/user/shots',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + settings.dribbble_client_admin_token
        },
    };

    var request = https.request(options, function (response) {

        response.setEncoding('utf8');

        response.on('data', function (data) {
            var jsonResponse = JSON.parse(data);
            console.log(`响应主体:` + data);


        });

        response.on('end', function () {
            console.log('响应中已无数据。');
        });


    });

    request.on('error', function (e) {
        console.log(e.message);
        // deferred.reject();
    });
    // req.write(post_data);
    request.end();

});

router.get('/getImage', function (req, res, next) {

    var options = {
        hostname: settings.dribbble_site_url,
        path: settings.dribbble_popular_path,
        method: 'GET'
    };

    var request = https.request(options, function (response) {
        var html = '';

        response.setEncoding('utf-8'); //防止中文乱码


        response.on('data', function (chunk) {
            html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        response.on('end', function () {

            var $ = cheeerio.load(html); //采用cheerio模块解析html
            // res.render('image',{aaa: $('.rf-project-covers').each(function () {
            //         $(this).html()
            //     })});

            res.render('image',{aaa: $('ol').html()});

        });

    });
    request.on('error', function (err) {
        console.log(err);
    });

    request.end();

})
;


module.exports = router;
