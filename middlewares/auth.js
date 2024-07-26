const jwt = require("jsonwebtoken");
const ApiHandler = require("../utils/ApiHandler");

exports.isUserAuth = (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return next(new ApiHandler(401, "Please login to continue!"));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
	if (!decoded) {
		return next(new ApiHandler(401, "Please login to continue!!"));
	}
	req.user = decoded;
	next();
};
