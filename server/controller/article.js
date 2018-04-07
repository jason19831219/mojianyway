const ArticleModel = require("../models").Article;
const {settings, service} = require('../../utils');
const https = require('https');
const cheerio = require('cheerio');
const _ = require('lodash');
const schedule = require('node-schedule');
const chinaTime = require('china-time');

class Article {


  constructor() {
    // super()
    global.articleSpiderArrayBehance = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }

  async getArticleLinkBG(item) {

    var path = '';
    var indexOfSpiderHours = settings.spider_time.indexOf(parseInt(chinaTime('HH'), 10));
    if (settings.spider_path.indexOf(item) === 2) {
      path = item.site_path[global.articleSpiderArrayBehance[(indexOfSpiderHours === -1 ? 1 : indexOfSpiderHours) * 2]];
    } else if (settings.spider_path.indexOf(item) === 3) {
      path = item.site_path[global.articleSpiderArrayBehance[(indexOfSpiderHours === -1 ? 1 : indexOfSpiderHours) * 2 + 1]];
    } else {
      path = item.site_path
    }
    console.log(path+chinaTime('DD HH'))

   var options = {
      method: 'GET',
      hostname: item.site_url,
      path: path,
    };
    var domPath = item.dom_path;
    var fromSite = item.site_url;
    var cutPath = item.link_cut_path;
    var maxNumber = item.max_num;

    return new Promise(async (resolve, reject) => {


      var request = https.request(options, (response) => {

        var html = '';
        response.setEncoding('utf-8'); //防止中文乱码
        response.on('data', function (chunk) {
          html += chunk;
        });

        response.on('end', async () => {
          var $ = cheerio.load(html);
          var count = 0;
          $(domPath).each(async (i, obj) => {
            if (i < maxNumber) {
              var img_detail_link = $(obj).attr('href');
              img_detail_link = encodeURI(img_detail_link.substr(cutPath.length));
              var article = await ArticleModel.find().or([{'detailLink': img_detail_link}])

              if (!_.isEmpty(article)) {
                var conditions = {detailLink: img_detail_link};
                var updates = {};

                await ArticleModel.update(conditions, updates)
                  .catch(err => {
                    console.log(err)
                  })

              } else {
                var articleObj = {
                  detailLink: img_detail_link,
                  fromSite: fromSite
                }

                var newArticle = new ArticleModel(articleObj);
                await newArticle.save()
                  .catch(err => {
                    console.log(err)
                  });
              }
              count++;
              if (count === maxNumber) {

                resolve();
              }
            }
          })
        });

      });
      request.on('error', function (err) {
        reject(err)
      });
      request.end();

      setTimeout(function () {
        resolve();
      }, settings.request_max_timeout)

    })


  }

  async getArticleDetailBG(articleObj) {

    console.log(articleObj.detailLink)
    var options = {
      method: 'GET',
      hostname: articleObj.fromSite,
      path: encodeURI(articleObj.detailLink)
    };

    var spider_path = settings.spider_path.find(item => item.site_url === articleObj.fromSite)
    var imageDomPath = spider_path.img_dom_path;
    var imageDomSinglePath = spider_path.img_dom_single_path;
    var titleDomPath = spider_path.title_dom_path;
    var authorDomPath = spider_path.author_dom_path;
    var authorDomMultiPath = spider_path.author_dom_multi_path;
    var avatarDomPath = spider_path.avatar_dom_path;
    var descriptionDomPath = spider_path.description_dom_path;

    return new Promise(async (resolve, reject) => {

      var request = https.request(options, (response) => {
        var html = '';

        response.setEncoding('utf-8'); //防止中文乱码
        response.on('data', function (chunk) {
          html += chunk;
        });

        response.on('end', async () => {
          var $ = cheerio.load(html);
          var imageSrc = [];
          $(imageDomPath).each((i, obj) => {
            var imgPath = $(obj).attr('srcset');
            imageSrc.push(imgPath);
          });

          if (!imageSrc.length) {
            imageSrc.push($(imageDomSinglePath).attr('src'));
          }

          var author = [];
          $(authorDomPath).each((i, obj) => {
            var authorName = $(obj).text();
            author.push(authorName);
          });

          if (!author.length) {
            $(authorDomMultiPath).each((i, obj) => {
              var authorName = $(obj).text();
              author.push(authorName);
            });
          }

          var title = $(titleDomPath).text();
          var avatar = $(avatarDomPath).attr('src');
          var description = $(descriptionDomPath).text();


          var conditions = {detailLink: articleObj.detailLink};
          var updates = {
            title: title,
            author: author,
            avatar: avatar,
            description: description,
            imgSrc: imageSrc
          };
          await ArticleModel.findOneAndUpdate(conditions, updates);
          console.log('DetailGot')
          resolve();
        });
      });




      request.on('error', function (err) {
        console.log(err);
        reject(err)
      });

      request.end();


      setTimeout(function () {
        resolve();
      }, settings.request_max_timeout)

    })

  }


  async getArticlesBG() {
    schedule.scheduleJob(settings.spider_time_create_cron, async function () {
      global.articleSpiderArrayBehance = await service.getBehanceSpiderArray();
      console.log(global.articleSpiderArrayBehance)
    });
    //
    var spiderRule = new schedule.RecurrenceRule();
    spiderRule.hour = settings.spider_time;
    spiderRule.minute = 0;
    spiderRule.second = 0;
    //
    schedule.scheduleJob(spiderRule, async () => {
      for (var i = 0; i < settings.spider_path.length; i++) {
        await this.getArticleLinkBG(settings.spider_path[i])
          .catch(err => {
            console.log(err)
          });
      }
      //
      var conditions = {imgSrc: []};
      var noDetailArticles = await ArticleModel.find(conditions);

      for (var i = 0; i < noDetailArticles.length; i++) {
        await this.getArticleDetailBG(noDetailArticles[i])
          .catch(err => {
            console.log(err)
          });
      }
      console.log(chinaTime('HH:MM:SS'))
    })
  }

  async getArticles(req, res, next) {
    let pageNumber = req.query.pageNumber || 1;
    let pageSize = req.query.pageSize || 10;
    let searchkey = req.query.searchkey;
    let contentId = req.query.contentId;
    let author = req.query.user;
    let queryObj = {};
    if (contentId) {
      queryObj.contentId = contentId;
    }
    if (searchkey) {
      let reKey = new RegExp(searchkey, 'i')
      queryObj.content = {$regex: reKey}
    }
    if (author) {
      queryObj.author = author;
    }
    queryObj.imgSrc = {$ne: []}
    const articles = await ArticleModel.find(queryObj).sort({
      updateTime: -1
    }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
    const totalItems = await ArticleModel.count(queryObj);
    res.send({
      state: 'success',
      docs: articles,
      pageInfo: {
        totalItems,
        pageNumber: Number(pageNumber) || 1,
        pageSize: Number(pageSize) || 10,
        searchkey: searchkey || ''
      }
    })
  }


}

module.exports = new Article();