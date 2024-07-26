const Brand = require("../models/brand.model");
const ApiHandler = require("../utils/ApiHandler");

//create brand
exports.createBrandCtrl = async (req, res, next) => {
	const { title } = req.body;
	try {
		const findBrand = await Brand.findOne({ title });

		if (findBrand) {
			return next(new ApiHandler(400, "Brand already exists"));
		}
		const createBrand = await Brand.create({
			title,
		});
		res.status(201).json(createBrand);
	} catch (error) {
		next(error);
	}
};

// update brand
exports.updateBrandCtrl = async (req, res, next) => {
	const { title } = req.body;

	try {
		const findBrand = await Brand.findById(req.params.id);

		if (!findBrand) {
			return next(new ApiHandler(404, "Brand not found"));
		}

		const updateteBrand = await Brand.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					title,
				},
			},
			{ new: true }
		);

		res.status(200).json(updateteBrand);
	} catch (error) {
		next(error);
	}
};

//Get brand
exports.getBrandCtrl = async (req, res, next) => {
	try {
		const findBrand = await Brand.findById(req.params.id);
		if (!findBrand) {
			return next(new ApiHandler(404, "Brand not found"));
		}
		res.status(200).json(findBrand);
	} catch (error) {
		next(error);
	}
};

//Get all brand
exports.getAllBrandCtrl = async (req, res, next) => {
	try {
		const brands = await Brand.find();
		if (brands.length === 0) {
			return next(new ApiHandler(404, "No brands available"));
		}
		res.status(200).json(brands);
	} catch (error) {
		next(error);
	}
};

//delete brand
exports.deleteBrandCtrl = async (req, res, next) => {
	try {
		const findBrand = await Brand.findById(req.params.id);

		if (!findBrand) {
			return next(new ApiHandler(404, "Brand not found"));
		}

		const brand = await Brand.findByIdAndDelete(req.params.id);

		res.status(200).json(brand);
	} catch (error) {
		next(error);
	}
};
