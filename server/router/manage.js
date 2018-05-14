const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const url = require("url");
const moment = require("moment");
const fs = require("fs");
const https = require("https");
const qs = require("querystring");
const path = require("path");

// 新建一个对象，建议只保存一个对象调用服务接口

const {
	Moji,
	Admin,
	Article,
	MojiSet
} = require("../controller");
const {
	service,
	authAdmin,
	settings
} = require("../../utils");

// var AipFaceClient = require("baidu-aip-sdk").face;
// var APP_ID = settings.aip_appID;
// var API_KEY = settings.aip_api_key;
// var SECRET_KEY = settings.aip_secret_key;


router.use(function(req, res, next) {
	if(req.signedCookies[settings.admin_auth_cookie_name]) {}
	next();
});
router.post("/admin/addOne",authAdmin, Admin.addOne);
router.post("/admin/login", Admin.login);
router.post("/admin/logOut", Admin.logOut);


router.get("/article/getAll", authAdmin, Article.getAll);
router.post("/article/addOne",authAdmin, Article.addOne);
router.post("/article/updateOne",authAdmin, Article.updateOne);
router.get("/article/deleteOne",authAdmin, Article.deleteOne);

router.post("/moji/addOne",authAdmin, Moji.addOne);
router.get("/moji/getAll",authAdmin, Moji.getAll);

router.post("/mojiSet/addOne",authAdmin, MojiSet.addOne);
router.post("/mojiSet/updateMojiItem",authAdmin, MojiSet.updateMojiItem);
router.get("/mojiSet/getList",authAdmin, MojiSet.getList);


// function base64_encode(file) {
// 	var bitmap = fs.readFileSync(path.join(__dirname,"../../public/upload/images/",file));
// 	return new Buffer(bitmap).toString("base64");
// }
//
// router.get("/startAipFace", function (req, res, next) {
// 	var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
// 	var image = base64_encode("wechat.jpeg");
//
// 	var imageType = "BASE64";
// 	var options = {};
// 	options["face_field"] = "age,beauty,expression,faceshape,gender,glasses,landmark,race,qualities";
// 	options["max_face_num"] = "1";
//
// 	// 带参数调用人脸检测
// 	client.detect(image, imageType, options).then(function(result) {
// 		if(!result.error_code){
//             console.log(result.error_code);
// 		}
//
// 	}).catch(function(err) {
// 		// 如果发生网络错误
// 		console.log(err);
// 	});
// });


router.post("/uploads", (req, res, next) => {

	//    获取传入参数
	let params = url.parse(req.url, true);
	let fileType = params.query.type;


	let form = new formidable.IncomingForm();
	let uploadPath = settings.upload_path;
	let newFileName = "";
	form.uploadDir = uploadPath;
	form.maxFileSize = settings.size_moji_upload;

	try{
		form.parse(req)
			.on("file", function (name, file) {
				let realFileType = service.getFileMimeType(file.path);
				let typeKey = "others";
				let thisType = file.name.split(".")[1];
				let ms = moment(new Date()).format("YYYYMMDDHHmmss").toString();
				if (fileType == "images") {
					typeKey = "img";
				}
				newFileName = typeKey + ms + "." + thisType;

				if (fileType == "images") {
					if (realFileType.fileType == "jpg" || realFileType.fileType == "jpeg" || realFileType.fileType == "png" || realFileType.fileType == "gif") {
						fs.rename(file.path, uploadPath + newFileName, function () {
							var imageBuf = fs.readFileSync(path.join(__dirname, "../../"+uploadPath + newFileName));
							res.send(
								{
									state: "success",
									message: "上传成功!",
									info:
										{
											path: "/"+uploadPath + newFileName
										}
								});
						});

					}
				}
			})
			.on("error", function (err) {
				res.send({
					state: "error",
					massage: err.toString()
				});
			})
			.on("end", function () {

			});
	}catch (e) {
		res.send({
			state: "error",
			massage: e.toString()
		});
	}




});


module.exports = router;
