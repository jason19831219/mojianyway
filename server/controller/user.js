const UserModel = require("../models").User;
const formidable = require('formidable');
const {service, settings} = require('../../utils');
const _ = require('lodash');
const SMSClient = require('@alicloud/sms-sdk');

const redis = require('redis');
const redisClient = redis.createClient(settings.redis_port, settings.redis_host, {auth_pass: settings.redis_psd});
redisClient.select("15", function (err) {
  if (err) {
    return false;
  } else {
    console.log('Redis Ready');
  }
});

class User {
  constructor() {
    // super()
  }

  // async loginAction(req, res, next) {
  //   const form = new formidable.IncomingForm();
  //   form.parse(req, async (err, fields, files) => {
  //     try {
  //       let newPsd = service.encrypt(fields.password, settings.encrypt_key);
  //       let errMsg = '';
  //       if (!validatorUtil.checkEmail(fields.email)) {
  //         errMsg = '请输入正确的邮箱'
  //       } else if (!validatorUtil.checkPwd(fields.password)) {
  //         errMsg = '请输入正确的密码'
  //       }
  //       if (errMsg) {
  //         throw new siteFunc.UserException(errMsg);
  //       }
  //     } catch (err) {
  //       console.log(err.message, err);
  //       res.send({
  //         state: 'error',
  //         type: 'ERROR_PARAMS',
  //         message: err.message
  //       })
  //       return;
  //     }
  //     const userObj = {
  //       email: fields.email,
  //       password: service.encrypt(fields.password, settings.encrypt_key),
  //     }
  //     try {
  //       let user = await UserModel.findOne(userObj);
  //       if (user) {
  //         if (!user.enable) {
  //           res.send({
  //             state: 'error',
  //             message: "您已被限制登录，请稍后重试"
  //           });
  //         }
  //         // 将cookie存入缓存
  //         let auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  //         res.cookie(settings.auth_cookie_name, auth_token,
  //           { path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true }); //cookie 有效期30天
  //
  //         res.send({
  //           state: 'success'
  //         });
  //       } else {
  //         logUtil.error(err, req);
  //         res.send({
  //           state: 'error',
  //           message: "用户名或密码错误"
  //         });
  //       }
  //     } catch (err) {
  //       res.send({
  //         state: 'error',
  //         type: 'ERROR_IN_SAVE_DATA',
  //         message: err.stack
  //       })
  //     }
  //
  //   })
  // }

  async getUsers(req, res) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;
      let searchkey = req.query.searchkey, queryObj = {};

      if (searchkey) {
        let reKey = new RegExp(searchkey, 'jason')
        queryObj.userName = {$regex: reKey}
      }

      const Users = await UserModel.find(queryObj, {password: 0}).sort({date: -1}).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));
      const totalItems = await UserModel.count(queryObj);
      // console.lgo("totalItems"+totalItems);

      // req.session.user = _.assign(req.session.user, {
      //   username:"sdfsd"
      // });

      // console.log(req.body);
      // req.session.user = {name:'sdfdsf'};

      if (req.session.sign) {//检查用户是否已经登录
        // console.log(req.session);//打印session的值
      } else {

        // console.log(req.session);
        req.session.sign = true;
        req.session.name = 'https://github.com/CleverFan';
      }
      res.cookie('userId', '123412342134', {
        path: '/',
        maxAge: 5000000,
      });

      res.send({
        state: 'success',
        msg: req.headers.cookie,
        docs: Users,
        pageInfo: {
          totalItems,
          current: Number(current) || 1,
          pageSize: Number(pageSize) || 10,
          searchkey: searchkey || ''
        }
      })
    } catch (err) {
      console.log(err)
      res.send({
        state: 'error',
        type: 'ERROR_DATA',
        message: '获取User失败'
      })
    }
  }


  async getSmsCode(req, res) {


    var mobile = req.body.mobile;
    var smsCodeName = mobile + "_smslogin";
    var smsCode = '';


    const accessKeyId = settings.sms_access_id;
    const secretAccessKey = settings.sms_access_secret;
    let smsClient = new SMSClient({accessKeyId, secretAccessKey});

    smsCode = service.randomCode();
    var templateParm = {"code": smsCode};

    var response = await smsClient.sendSMS({
      PhoneNumbers: mobile,
      SignName: '陌及MoJi',
      TemplateCode: settings.sms_template_id,
      TemplateParam: JSON.stringify(templateParm)
    })
    console.log(response);
    if (response.Code === 'OK') {
      res.send({
        state: 'success',
        message: '获取smscode成功'
      });
      redisClient.set(smsCodeName, smsCode);
      redisClient.expire(smsCodeName, 30000000);
    } else {
      res.send({
        state: 'error',
        message: err.data.Message
      });
    }


  }

  async doReg(req, res) {
    var mobile = req.body.mobile;
    var mobileExt = req.body.mobile + '_smslogin';
    var smsCode = req.body.smsCode;

    var isExist = redisClient.exists(mobileExt);
    if (isExist) {
      redisClient.get(mobileExt, async (err, reply) => {
        if (reply === smsCode) {
          try {

            const userObj = {
              userName: 'uid_' + mobile,
              mobile: mobile,
              password: service.encrypt(settings.default_password, settings.encrypt_key),
            }

            var user = await UserModel.find().or([{'mobile': mobile}])
            if (!_.isEmpty(user)) {
              req.session.signed = true;
              delete userObj.password;
              req.session.userInfo = userObj;
              res.send({
                state: 'success',
                message: "登录成功！"
              });
            } else {
              let newUser = new UserModel(userObj);
              await newUser.save();
              req.session.signed = true;
              delete userObj.password;
              req.session.userInfo = userObj;
              res.send({
                state: 'success',
                message: "注册成功！"
              });
            }
          } catch (err) {
            res.send({
              state: 'error',
              type: 'ERROR_IN_SAVE_DATA',
              message: err.stack
            })
          }
        } else {
          res.send({
            state: 'error',
            message: '验证码不正确'
          })
        }
      })
    }
  }


// async regAction(req, res, next) {
//   const form = new formidable.IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     try {
//       let newPsd = service.encrypt(fields.password, settings.encrypt_key);
//       let errMsg = '';
//
//       if (!validatorUtil.checkUserName(fields.userName)) {
//         errMsg = '5-12个英文字符!';
//       }
//       if (!validatorUtil.checkEmail(fields.email)) {
//         errMsg = '请输入正确的邮箱'
//       }
//       if (!validatorUtil.checkPwd(fields.password)) {
//         errMsg = '请输入正确的密码'
//       }
//       if (fields.password != fields.confirmPassword) {
//         errMsg = '两次输入密码不一致，请重新输入'
//       }
//       if (errMsg) {
//         throw new siteFunc.UserException(errMsg);
//       }
//     } catch (err) {
//       console.log(err.message, err);
//       res.send({
//         state: 'error',
//         type: 'ERROR_PARAMS',
//         message: err.message
//       })
//       return;
//     }
//     const userObj = {
//       userName: fields.userName,
//       email: fields.email,
//       password: service.encrypt(fields.password, settings.encrypt_key),
//     }
//     try {
//       let user = await UserModel.find().or([{ 'email': fields.email }, { userName: fields.userName }])
//       if (!_.isEmpty(user)) {
//         res.send({
//           state: 'error',
//           message: '邮箱或用户名已存在！'
//         });
//       } else {
//         let newUser = new UserModel(userObj);
//         await newUser.save();
//
//         res.send({
//           state: 'success',
//           message: "注册成功！"
//         });
//       }
//     } catch (err) {
//       res.send({
//         state: 'error',
//         type: 'ERROR_IN_SAVE_DATA',
//         message: err.stack
//       })
//     }
//
//   })
// }

  async logOut(req, res, next) {
    req.session.destroy();
    res.clearCookie(settings.auth_cookie_name, {path: '/'});
    res.send({
      state: 'success',
    })
  }

}

module.exports = new User();
