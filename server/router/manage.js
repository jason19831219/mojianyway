const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const url = require("url");
const moment = require("moment");
const fs = require("fs");




const {
	Moji,
	Admin,
	Article,
	MojiSet
} = require("../controller");
const {
	service,
	authAdmin,
	settings,
} = require("../../utils");

router.use(function(req, res, next) {
	if(req.signedCookies[settings.admin_auth_cookie_name]) {}
	next();
});
router.post("/admin/addOne",authAdmin, Admin.addOne);
router.post("/admin/login", Admin.login);
router.post("/admin/logOut", Admin.logOut);


router.get("/article/getList", authAdmin, Article.getArticles);

router.post("/article/updateArticle",authAdmin, Article.updateArticle);

router.post("/moji/addOne",authAdmin, Moji.addOne);
router.get("/moji/getAll",authAdmin, Moji.getAll);

router.post("/mojiSet/addOne",authAdmin, MojiSet.addOne);
router.get("/mojiSet/getList",authAdmin, MojiSet.getList);

router.post("/uploads",authAdmin, (req, res, next) => {

	//    获取传入参数
	let params = url.parse(req.url, true);
	let fileType = params.query.type;


	let form = new formidable.IncomingForm();
	let uploadPath = settings.upload_path;
	let newFileName = "";
	form.uploadDir = uploadPath;
	form.maxFileSize = settings.size_moji_upload;
	// form.multiples = false;


	//存放目录

	try{
		form.parse(req)
			.on("field", function (name, field) {

			})
			.on("file", function (name, file) {
				//console.log('Got file:', name);

				// specify that we want to allow the user to upload multiple files in a single request
				//form.multiples = true;

				// store all uploads in the /uploads directory

				let realFileType = service.getFileMimeType(file.path);
				let typeKey = "others";
				let thisType = file.name.split(".")[1];
				let ms = moment(new Date()).format("YYYYMMDDHHmmss").toString();




				if (fileType == "images") {
					typeKey = "img";
				}
				newFileName = typeKey + ms + "." + thisType;

				console.log(newFileName+"newFileName");

				if (fileType == "images") {
					if (realFileType.fileType == "jpg" || realFileType.fileType == "jpeg" || realFileType.fileType == "png" || realFileType.fileType == "gif") {
						fs.rename(file.path, uploadPath + newFileName, function () {
							res.send(
								{
									state: "success",
									message: "上传成功!",
									info:
                    {
                    	path: uploadPath + newFileName
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
			massage: err.toString()
		});
	}




});


module.exports = router;
