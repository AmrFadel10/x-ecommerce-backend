const Color = require("../models/color.model");
const ApiHandler = require("../utils/ApiHandler");

//create color
exports.createColorCtrl = async (req, res, next) => {
	const { title } = req.body;
	try {
		const findColor = await Color.findOne({ title });

		if (findColor) {
			return next(new ApiHandler(400, "Color already exists"));
		}
		const createColor = await Color.create({
			title,
		});
		res.status(201).json(createColor);
	} catch (error) {
		next(error);
	}
};

// update color
exports.updateColorCtrl = async (req, res, next) => {
	const { title } = req.body;

	try {
		const findColor = await Color.findById(req.params.id);

		if (!findColor) {
			return next(new ApiHandler(404, "Color not found"));
		}

		const updateteColor = await Color.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					title,
				},
			},
			{ new: true }
		);

		res.status(200).json(updateteColor);
	} catch (error) {
		next(error);
	}
};

//Get color
exports.getColorCtrl = async (req, res, next) => {
	try {
		const findColor = await Color.findById(req.params.id);
		if (!findColor) {
			return next(new ApiHandler(404, "Color not found"));
		}
		res.status(200).json(findColor);
	} catch (error) {
		next(error);
	}
};

//Get all color
exports.getAllColorCtrl = async (req, res, next) => {
	try {
		const colors = await Color.find();
		if (colors.length === 0) {
			return next(new ApiHandler(404, "No colors available"));
		}
		res.status(200).json(colors);
	} catch (error) {
		next(error);
	}
};

//delete color
exports.deleteColorCtrl = async (req, res, next) => {
	try {
		const findColor = await Color.findById(req.params.id);

		if (!findColor) {
			return next(new ApiHandler(404, "Color not found"));
		}

		const color = await Color.findByIdAndDelete(req.params.id);

		res.status(200).json(color);
	} catch (error) {
		next(error);
	}
};
