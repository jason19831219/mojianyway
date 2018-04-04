const express = require("express");
const router = express.Router();
const formidable = require('formidable')
const url = require('url');
const moment = require('moment');
const fs = require('fs');

const {
  Moji,
  AdminUser,
  Article
} = require("../controller");
const {
  mime,
  service,
  authAdminSession,
  settings,
} = require("../../utils");


// 管理员退出
router.get("/logout", (req, res) => {
  req.session.adminlogined = false;
  req.session.adminPower = "";
  req.session.adminUserInfo = "";
  res.send({
    state: "success"
  });
});

// // 获取管理员信息
// router.get("/getUserSession", authAdminSession, AdminUser.getUserSession);
//
// // 获取后台基础信息
// router.get("/getSitBasicInfo", authSession, authPower, AdminUser.getBasicSiteInfo);

/**
 * 管理员管理
 */
// router.get("/adminUser/getList", authToken, authPower, AdminUser.getAdminUsers);
//
// router.post("/adminUser/addOne", AdminUser.addAdminUser);
//
// router.post("/adminUser/updateOne", authToken, authPower, AdminUser.updateAdminUser);
//
// router.get("/adminUser/deleteUser", authToken, authPower, AdminUser.delAdminUser);

router.get("/article/getList", Article.getArticles);

router.post("/moji/addOne", Moji.setMoji);

router.get("/moji/getList", Moji.getList);


router.post('/uploads', (req, res, next) => {

  //    获取传入参数
  let params = url.parse(req.url, true);
  let fileType = params.query.type;


  let form = new formidable.IncomingForm();
  let uploadPath = settings.upload_path;
  let newFileName = '';
  form.uploadDir = uploadPath;
  form.maxFileSize = settings.size_moji_upload;
  // form.multiples = false;


  //存放目录

  try{
    form.parse(req)
      .on('field', function (name, field) {

      })
      .on('file', function (name, file) {
        //console.log('Got file:', name);

        // specify that we want to allow the user to upload multiple files in a single request
        //form.multiples = true;

        // store all uploads in the /uploads directory

        let realFileType = service.getFileMimeType(file.path);
        let typeKey = "others";
        let thisType = file.name.split('.')[1];
        let ms = moment(new Date()).format('YYYYMMDDHHmmss').toString();




        if (fileType == 'images') {
          typeKey = "img"
        }
        newFileName = typeKey + ms + "." + thisType;

        console.log(newFileName+'newFileName')

        if (fileType == 'images') {
          if (realFileType.fileType == 'jpg' || realFileType.fileType == 'jpeg' || realFileType.fileType == 'png' || realFileType.fileType == 'gif') {
            fs.rename(file.path, uploadPath + newFileName, function () {
              res.send(
                {
                  state: 'success',
                  message: '上传成功!',
                  info:
                    {
                      path: uploadPath + newFileName
                    }
                });
            })

          }
        }
      })
      .on('error', function (err) {
        res.send({
          state: 'error',
          massage: err.toString()
        });
      })
      .on('end', function () {

      });
  }catch (e) {
    res.send({
      state: 'error',
      massage: err.toString()
    });
  }




});


module.exports = router;
