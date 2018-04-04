var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var shortid = require("shortid");
var moment = require("moment");

var UserSchema = new Schema({
  _id: {
    type: String,
    "default": shortid.generate
  },
  enable: {type: Boolean, default: true}, //用户是否有效
  name: String,
  userName: String,
  password: String,
  qq: Number,
  mobile: Number,
  phoneNum: Number,
  comments: {type: String, default: "这个人很懒，什么都没有留下..."},
  date: {type: Date, default: Date.now},
  actionPoint: {type: Number, default: 20},

  logo: {type: String, default: "/upload/images/defaultlogo.png"},
  group: {type: String, default: "0"},
  isadmin: {type: Boolean, default: false},
  gender: String,
  openid: String,
  createTime: {type: Number}

});

// UserSchema.set("toJSON", { getters: true, virtuals: true });
// UserSchema.set("toObject", { getters: true, virtuals: true });

UserSchema.path("date").get(function (v) {
  return moment(v).format("YYYY-MM-DD HH:mm:ss");
});


var User = mongoose.model("User", UserSchema);
module.exports = User;
