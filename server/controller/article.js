const ArticleModel = require("../models").Article;
const {settings, service} = require('../../utils');
const https = require('https');
const cheerio = require('cheerio');
const _ = require('lodash');
const schedule = require('node-schedule');
const chinaTime = require('china-time');

function checkFormData(fields) {
    let errMsg = '';
    if (!fields.title ) {
        errMsg = '没有title';
    }
    if (!fields.imgSrc) {
        errMsg = '没有图片';
    }
    return errMsg;
}

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

        })


    }

    async getArticleDetailBG(articleObj) {


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
                        var imgPathSet = $(obj).attr('srcset');
                        if (imgPathSet != undefined) {
                            var imageSrcArray = imgPathSet.split(",");
                            var imgPathArray = [];
                            for (var i = 0; i < imageSrcArray.length; i++) {
                                if (imageSrcArray[i]) {
                                    imgPathArray.push(imageSrcArray[i]);
                                }
                            }
                            imageSrc.push(imgPathArray)
                        }
                    });
                    if (!imageSrc.length) {
                        imageSrc.push($(imageDomSinglePath).attr('src'));
                    }

                    var author = '';
                    $(authorDomPath).each((i, obj) => {
                        var authorName = $(obj).text();
                        author = author + authorName.replace(/\n/g, '').replace(/(^\s*)|(\s*$)/g, '') + ',';
                    });

                    if (!author) {
                        $(authorDomMultiPath).each((i, obj) => {
                            var authorName = $(obj).text();
                            author = author + authorName.replace(/\n/g, '').replace(/(^\s*)|(\s*$)/g, '')+ ',';
                        });
                    }

                    var title = $(titleDomPath).text();
                    var authorAvatarSrc = $(avatarDomPath).attr('src');
                    var description = $(descriptionDomPath).text();


                    var conditions = {detailLink: articleObj.detailLink};
                    var updates = {
                        title: title,
                        author: author,
                        authorAvatarSrc: authorAvatarSrc,
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
        });
        var spiderRule = new schedule.RecurrenceRule();
        spiderRule.hour = settings.spider_time;
        spiderRule.minute = 0;
        spiderRule.second = 0;
        //
        // schedule.scheduleJob(spiderRule, async () => {
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
        // })
    }

    async updateOne(req, res, next) {
        var fields = req.body;
        var errmsg = checkFormData(fields);
        if (errmsg != '') {
            res.send({
                state: 'error',
                message: errmsg
            })
            return
        }

        const articleObj = {
            title: fields.title,
            author: fields.author,
            authorAvatarSrc: fields.authorAvatarSrc,
            imgSrc: fields.imgSrc,
            fromSite: fields.fromSite,
            sticky: fields.sticky
        }

        try {
            await ArticleModel.findOneAndUpdate({ _id: fields.id }, { $set: articleObj });
            res.send({
                state: 'success',
                message: '更新成功',
            });
        } catch (err) {
            res.send({
                state: 'error',
                message: '更新失败:',
            })
        }
    }

    async getAll(req, res, next) {
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
            updateDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
        const totalItems = await ArticleModel.count(queryObj);
        res.send({
            state: 'success',
            list: articles,
            pageInfo: {
                totalItems,
                pageNumber: Number(pageNumber) || 1,
                pageSize: Number(pageSize) || 10,
                searchkey: searchkey || ''
            }
        })
    }

    async addOne(req, res) {
        var fields = req.body;
        var errmsg = checkFormData(fields);
        if (errmsg != '') {
            res.send({
                state: 'error',
                message: errmsg
            })
            return
        }

        const articleObj = {
            title: fields.title,
            author: [fields.author],
            authorAvatarSrc: fields.authorAvatarSrc,
            imgSrc: fields.imgSrc,
            fromSite: fields.fromSite,
            sticky: fields.sticky
        }

        try {
            let article = await ArticleModel.find({title: fields.title})
            if (!_.isEmpty(article)) {
                res.send({
                    state: 'error',
                    message: '名字已存在！'
                });
            } else {
                const newArticle = new ArticleModel(articleObj);
                await newArticle.save();
                res.send({
                    state: 'success',
                    id: '图片已保存'
                });
            }
        } catch (err) {
            res.send({
                state: 'error',
                message: '保存数据失败:',
            })
        }
    }


}

module.exports = new Article();
