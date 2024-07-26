const SubCategory = require("../models/subCategory.model");
const ApiHandler = require("../utils/ApiHandler");

//create subCategory
exports.createSubCategoryCtrl = async (req, res, next) => {
	const { title } = req.body;
	try {
		const findSubCategory = await SubCategory.findOne({ title });

		if (findSubCategory) {
			return next(new ApiHandler(400, "SubCategory already exists"));
		}
		const createSubCategory = await SubCategory.create({
			title,
		});
		res.status(201).json(createSubCategory);
	} catch (error) {
		next(error);
	}
};

// update subCategory
exports.updateSubCategoryCtrl = async (req, res, next) => {
	const { title } = req.body;

	try {
		const findSubCategory = await SubCategory.findById(req.params.id);

		if (!findSubCategory) {
			return next(new ApiHandler(404, "SubCategory not found"));
		}

		const updateteSubCategory = await SubCategory.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					title,
				},
			},
			{ new: true }
		);

		res.status(200).json(updateteSubCategory);
	} catch (error) {
		next(error);
	}
};

//Get subCategory
exports.getSubCategoryCtrl = async (req, res, next) => {
	try {
		const findSubCategory = await SubCategory.findById(req.params.id);
		if (!findSubCategory) {
			return next(new ApiHandler(404, "SubCategory not found"));
		}
		res.status(200).json(findSubCategory);
	} catch (error) {
		next(error);
	}
};

//Get all subCategory
exports.getAllSubCategoryCtrl = async (req, res, next) => {
	try {
		const categories = await SubCategory.find();
		if (categories.length === 0) {
			return next(new ApiHandler(404, "No categories available"));
		}
		res.status(200).json(categories);
	} catch (error) {
		next(error);
	}
};

//delete subCategory
exports.deleteSubCategoryCtrl = async (req, res, next) => {
	try {
		const findSubCategory = await SubCategory.findById(req.params.id);

		if (!findSubCategory) {
			return next(new ApiHandler(404, "SubCategory not found"));
		}

		const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

		res.status(200).json(subCategory);
	} catch (error) {
		next(error);
	}
};
