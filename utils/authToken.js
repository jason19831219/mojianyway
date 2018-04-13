const jwt = require("jsonwebtoken");
const settings = require("./settings");

module.exports = (req, res, next) => {
	if (!(req.headers && req.headers.authorization)) {
		res.status(401);
		res.send({
			status: "error",
			message: "No token provided."
		});
		return;
	}
	var parts = req.headers.authorization.split(" ");
	if (parts.length != 2) {
		res.status(401);
		res.send({
			status: "error",
			message: "No token provided."
		});
		return;
	}
	var scheme = parts[0];
	var credentials = parts[1];

	if (!(/^Bearer$/i.test(scheme))) {
		res.status(401);
		res.send({
			status: "error",
			message: "No token provided."
		});
		return;
	}
	var token = credentials;
	console.log(credentials+'credentials')

	try {
		let decoded = jwt.decode(token, settings.jwt_secret);
		if (decoded.exp <= Date.now()) {
			res.status(401);
			res.send({
				status: "error",
				message: "token expired."
			});
			return;
		}
		req.userId = decoded.userId;
		return next();
	} catch (error) {
		res.send({
			status: "error",
			message: "token decode failed"
		});
		return;
	}
};
