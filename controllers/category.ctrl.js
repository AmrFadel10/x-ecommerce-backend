const Category = require("../models/category.model");
const ApiHandler = require("../utils/ApiHandler");

//create category
exports.createCategoryCtrl = async (req, res, next) => {
	const { title } = req.body;
	try {
		const findCategory = await Category.findOne({ title });

		if (findCategory) {
			return next(new ApiHandler(400, "Category already exists"));
		}
		const createCategory = await Category.create({
			title,
		});
		res.status(201).json(createCategory);
	} catch (error) {
		next(error);
	}
};

// update category
exports.updateCategoryCtrl = async (req, res, next) => {
	const { title } = req.body;

	try {
		const findCategory = await Category.findById(req.params.id);

		if (!findCategory) {
			return next(new ApiHandler(404, "Category not found"));
		}

		const updateteCategory = await Category.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					title,
				},
			},
			{ new: true }
		);

		res.status(200).json(updateteCategory);
	} catch (error) {
		next(error);
	}
};

//Get category
exports.getCategoryCtrl = async (req, res, next) => {
	try {
		const findCategory = await Category.findById(req.params.id);
		if (!findCategory) {
			return next(new ApiHandler(404, "Category not found"));
		}
		res.status(200).json(findCategory);
	} catch (error) {
		next(error);
	}
};

//Get all category
exports.getAllCategoryCtrl = async (req, res, next) => {
	try {
		const categories = await Category.find();
		if (categories.length === 0) {
			return next(new ApiHandler(404, "No categories available"));
		}
		res.status(200).json(categories);
	} catch (error) {
		next(error);
	}
};

//delete category
exports.deleteCategoryCtrl = async (req, res, next) => {
	try {
		const findCategory = await Category.findById(req.params.id);

		if (!findCategory) {
			return next(new ApiHandler(404, "Category not found"));
		}

		const category = await Category.findByIdAndDelete(req.params.id);

		res.status(200).json(category);
	} catch (error) {
		next(error);
	}
};
