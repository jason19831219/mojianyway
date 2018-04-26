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


router.get("/article/getAll", authAdmin, Article.getAll);

router.post("/article/addOne",authAdmin, Article.addOne);

router.post("/moji/addOne",authAdmin, Moji.addOne);
router.get("/moji/getAll",authAdmin, Moji.getAll);

router.post("/mojiSet/addOne",authAdmin, MojiSet.addOne);
router.post("/mojiSet/updateMojiItem",authAdmin, MojiSet.updateMojiItem);
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
							setTimeout(function () {
								res.send(
									{
										state: "success",
										message: "上传成功!",
										info:
                                            {
                                            	path: "/"+uploadPath + newFileName
                                            }
									});
							},100);

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
