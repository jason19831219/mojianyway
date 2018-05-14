const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const url = require("url");
const moment = require("moment");
const fs = require("fs");
const https = require("https");
const qs = require("querystring");
const path = require("path");

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


function base64_encode(file) {
	var bitmap = fs.readFileSync(path.join(__dirname,"../../public/upload/images/",file));
	return new Buffer(bitmap).toString("base64");
}

router.get("/startAipFace", function (req, res, next) {
	const param = qs.stringify({
		"grant_type": "client_credentials",
		"client_id": settings.aip_api_key,
		"client_secret": settings.aip_secret_key
	});
	var accessToken = "";
	console.log(base64_encode("wechat.jpeg"));
	https.get(
		{
			hostname: "aip.baidubce.com",
			path: "/oauth/2.0/token?" + param,
			agent: false
		},
		function (response) {
			var myStr = "";
			response.on("data", function(chunk) {
				myStr += chunk;
			});
			response.on("end", function() {
				accessToken = JSON.parse(myStr)["access_token"];
				res.send({
					state: "success",
					data: accessToken
				});
			});
		}
	);
});




function decode_base64(base64str , filename){

	var buf = Buffer.from(base64str,"base64");

	fs.writeFile(path.join(__dirname,"../../public/upload/images/",filename), buf, function(error){
		if(error){
			throw error;
		}else{
			console.log("File created from base64 string!");
			return true;
		}
	});

}


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
							var imageBuf = fs.readFileSync("/"+uploadPath + newFileName);
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
