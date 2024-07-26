const mongoose = require("mongoose");
const ApiHandler = require("../utils/ApiHandler");

exports.validateId = (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id.toString())) {
		return next(new ApiHandler(400, "Invalid id or not found"));
	}
	next();
};

exports.validateMongoDbID = (id) => {
	if (!mongoose.Types.ObjectId.isValid(id.toString())) {
		throw new ApiHandler(400, "Invalid id or not found");
	}
};
