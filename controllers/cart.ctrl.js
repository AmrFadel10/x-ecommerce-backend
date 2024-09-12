const Cart = require("../models/cart.model");
const { User } = require("../models/user.model");
const Coupon = require("../models/coupon.model");
const Product = require("../models/product.model");
const ApiHandler = require("../utils/ApiHandler");
const { validateMongoDbID } = require("../middlewares/validateId");

//------------------------------------------------------------------------------
//set cart
//------------------------------------------------------------------------------
exports.setUserCartCtrl = async (req, res, next) => {
	const { id } = req.user;
	const { product, price, color, quantity } = req.body;
	try {
		const user = await User.findById(id);
		if (!user) {
			return next(new ApiHandler(404, "Invalid user id"));
		}

		// if (alreadyExists) {
		// 	await alreadyExists.remove();
		// }

		const addToCart = await Cart.create({
			user: id,
			product,
			quantity,
			color,
			price,
		});

		return res.status(201).json(addToCart);
	} catch (error) {
		next(error);
	}
};

//------------------------------------------------------------------------------
//get cart
//------------------------------------------------------------------------------
exports.getUserCartCtrl = async (req, res, next) => {
	const { id } = req.user;
	try {
		// validateMongoDbID(id);

		const user = await User.findById(id);

		if (!user) {
			return next(new ApiHandler(404, "Invalid user id"));
		}

		const cart = await Cart.find({ user: user._id })
			.populate("product", "_id title price images")
			.populate("color", "title _id");

		if (!cart) {
			return next(new ApiHandler(404, "Cart is empty"));
		}

		return res.status(200).json(cart);
	} catch (error) {
		next(error);
	}
};

//------------------------------------------------------------------------------
//delete product from  cart
//------------------------------------------------------------------------------
exports.deleteProductFromCartCtrl = async (req, res, next) => {
	const { cartId } = req.params;
	try {
		// validateMongoDbID(id);

		const cart = await Cart.findByIdAndDelete(cartId);

		if (!cart) {
			return next(new ApiHandler(404, "Invalid cart id"));
		}

		return res.status(200).json("Product has been deleted from cart!");
	} catch (error) {
		next(error);
	}
};
//------------------------------------------------------------------------------
//update quantity product from  cart
//------------------------------------------------------------------------------
exports.updateProductFromCartCtrl = async (req, res, next) => {
	const { quantity } = req.body;
	const { cartId } = req.params;
	try {
		const cart = await Cart.findByIdAndUpdate(
			cartId,
			{ $set: { quantity } },
			{ new: true }
		);

		if (!cart) {
			return next(new ApiHandler(404, "Invalid cart id"));
		}

		return res.status(200).json(cart);
	} catch (error) {
		next(error);
	}
};

//------------------------------------------------------------------------------
//empty cart
//------------------------------------------------------------------------------
exports.emptyCartCtrl = async (req, res, next) => {
	const { id } = req.user;
	try {
		validateMongoDbID(id);
		const user = await User.findById(id);
		if (!user) {
			return next(new ApiHandler(404, "Invalid user id"));
		}
		const cart = await Cart.deleteMany({ user: user._id });

		if (!cart) {
			return next(new ApiHandler(400, "No cart provided for this user!"));
		}
		return res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
