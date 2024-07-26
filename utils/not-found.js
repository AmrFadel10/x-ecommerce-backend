const ApiHandler = require("./ApiHandler");

exports.notFound = async (req, res, next) => {
	next(new ApiHandler(404, `This route not found :${req.originalUrl}`));
};
