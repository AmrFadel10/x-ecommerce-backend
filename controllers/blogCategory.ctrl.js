const BlogCategory = require("../models/blogCategory.model");
const ApiHandler = require("../utils/ApiHandler");

//create blogCategory
exports.createBlogCategoryCtrl = async (req, res, next) => {
	const { title } = req.body;
	try {
		const findBlogCategory = await BlogCategory.findOne({ title });

		if (findBlogCategory) {
			return next(new ApiHandler(400, "BlogCategory already exists"));
		}
		const createBlogCategory = await BlogCategory.create({
			title,
		});
		res.status(201).json(createBlogCategory);
	} catch (error) {
		next(error);
	}
};

// update blogCategory
exports.updateBlogCategoryCtrl = async (req, res, next) => {
	const { title } = req.body;

	try {
		const findBlogCategory = await BlogCategory.findById(req.params.id);

		if (!findBlogCategory) {
			return next(new ApiHandler(404, "BlogCategory not found"));
		}

		const updateteBlogCategory = await BlogCategory.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					title,
				},
			},
			{ new: true }
		);

		res.status(200).json(updateteBlogCategory);
	} catch (error) {
		next(error);
	}
};

//Get blogCategory
exports.getBlogCategoryCtrl = async (req, res, next) => {
	try {
		const findBlogCategory = await BlogCategory.findById(req.params.id);
		if (!findBlogCategory) {
			return next(new ApiHandler(404, "BlogCategory not found"));
		}
		res.status(200).json(findBlogCategory);
	} catch (error) {
		next(error);
	}
};

//Get all blogCategory
exports.getAllBlogCategoryCtrl = async (req, res, next) => {
	try {
		const blogCategorys = await BlogCategory.find();
		if (blogCategorys.length === 0) {
			return next(new ApiHandler(404, "No blogCategorys available"));
		}
		res.status(200).json(blogCategorys);
	} catch (error) {
		next(error);
	}
};

//delete blogCategory
exports.deleteBlogCategoryCtrl = async (req, res, next) => {
	try {
		const findBlogCategory = await BlogCategory.findById(req.params.id);

		if (!findBlogCategory) {
			return next(new ApiHandler(404, "BlogCategory not found"));
		}

		const blogCategory = await BlogCategory.findByIdAndDelete(req.params.id);

		res.status(200).json(blogCategory);
	} catch (error) {
		next(error);
	}
};
