/**
 * Created by Administrator on 2015/4/15.
 * 管理员对象
 */
var mongoose = require("mongoose");
var shortid = require("shortid");
var Schema = mongoose.Schema;

var AdminGroup = require("./AdminGroup");

var AdminUserSchema = new Schema({
  id: String,
  _id: {
    type: String,
    "default": shortid.generate
  },
  name: String,
  userName: String,
  password: {type: String, required: true},
  phoneNum: Number,
  date: {type: Date, default: Date.now},
  group: {
    type: String,
    ref: "AdminGroup"
  }
});


// AdminUserSchema.statics = {
//   getOneItem: function (res, targetId, callBack) {
//     AdminUser.findOne({"_id": targetId}).populate("group").exec(function (err, user) {
//       if (err) {
//         res.end(err);
//       }
//       callBack(user);
//     });
//   }
// };


var AdminUser = mongoose.model("AdminUser", AdminUserSchema);

module.exports = AdminUser;

