/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var moment = require("moment");
moment.locale("zh-cn");
var shortid = require("shortid");
var ArticleSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	detailLink: {type: String, default: "/"},
	imgSrc: {type: [[]], default: []},
	title: String,
	author: [{ type: String, default: [] }],
	avatar: {type: String, default: "/"},
	// subtitle: String,
	// type: { type: String, default: "content" }, // 发布形式 默认为普通文档,约定 singer 为单页面文档
	// categories: [{ type: String, ref: "ContentCategory" }], //文章类别
	// sortPath: String, //存储所有父节点结构
	// tags: [{ type: String, ref: "ContentTag" }], // 标签
	// keywords: String,
	// sImg: { type: String, default: "/upload/images/defaultImg.jpg" }, // 文章小图
	description: String,
	fromSite: {
		type: String,
		default: ""
	},
	sticky: {
		type: Boolean,
		default: false
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	}
	// author: { type: String, ref: "AdminUser" }, // 文档作者
	// uAuthor: { type: String, ref: "User" }, // 文档作者(普通用户)
	// state: { type: Boolean, default: true },  // 是否在前台显示，默认显示
	// isTop: { type: Number, default: 0 },  // 是否推荐，默认不推荐 0为不推荐，1为推荐
	// clickNum: { type: Number, default: 1 },
	// comments: String,
	// markDownComments: String, // markdow格式
	// commentNum: { type: Number, default: 0 }, // 评论数
	// likeNum: { type: Number, default: 0 }, // 喜欢数
	// likeUserIds: [{ type: String, default: [] }], // 喜欢该文章的用户ID集合
	// from: { type: String, default: "1" }, // 来源 1为原创 2为转载 3为用户发送
}, {
	versionKey: false,
	timestamps: {createdAt: "createDate", updatedAt: "updateDate"}
});


ArticleSchema.set("toJSON", {getters: true, virtuals: true});
ArticleSchema.set("toObject", {getters: true, virtuals: true});

ArticleSchema.path("createDate").get(function (v) {
	return moment(v).startOf("hour").fromNow();
});
ArticleSchema.path("updateDate").get(function (v) {
	return moment(v).startOf("minute").fromNow();
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

