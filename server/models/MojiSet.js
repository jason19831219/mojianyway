/**
 * Created by Administrator on 2015/4/15.
 * 文章标签对象
 */
const mongoose = require("mongoose");
const shortid = require("shortid");
const moment = require("moment");
var Moji = require("./Moji");
var Schema = mongoose.Schema;

var MojiSetSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	name: String,
	desc: String,
	author: {
		type: String,
		default: ""
	},
	avatar: {
		type: String,
		default: "/"
	},
	enable: {
		type: Boolean,
		default: true
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	mojis: {
	    type: [],
		default: [''],
		ref: "Moji"
	},
	comments: String
});


MojiSetSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
MojiSetSchema.path("updateDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

var MojiSet = mongoose.model("MojiSet", MojiSetSchema);

module.exports = MojiSet;

