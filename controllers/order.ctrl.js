const { validateMongoDbID } = require("../middlewares/validateId");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { User } = require("../models/user.model");
const ApiHandler = require("../utils/ApiHandler");

exports.createOrderCtrl = async (req, res, next) => {
	const {
		shippingInfo,
		paymentInfo,
		orderItems,
		totalPrice,
		totalPriceAfterDiscount,
	} = req.body;

	const { id } = req.user;
	try {
		const order = await Order.create({
			shippingInfo,
			paymentInfo,
			orderItems,
			totalPrice,
			totalPriceAfterDiscount,
			user: id,
		});
		res.status(201).json({ order, success: true });
	} catch (error) {
		next(error);
	}
};

//----------------------------------------------------------------------------------
// exports.createOrderCtrl = async (req, res, next) => {
// 	const { COD, couponApplied } = req.body;
// 	const { id } = req.user;
// 	try {
// 		validateMongoDbID(id);

// 		if (!COD) {
// 			return next(new ApiHandler(400, "Create cash order failed!"));
// 		}
// 		const user = await User.findById(id);

// 		if (!user) {
// 			return next(new ApiHandler(400, "User not found!"));
// 		}

// 		const userCart = await Cart.findOne({ orderBy: id });

// 		let finalAmount = 0;
// 		if (couponApplied && userCart.totalAfterDiscount) {
// 			finalAmount = userCart.totalAfterDiscount;
// 		} else {
// 			finalAmount = userCart.cartTotal;
// 		}

// 		await Order.create({
// 			products: userCart.products,
// 			paymentIntent: {
// 				id: Date.now() + Math.random() * 1e9,
// 				method: "COD",
// 				amount: finalAmount,
// 				status: "Cash on Delivery",
// 				created: Date.now(),
// 				currency: "USD",
// 			},
// 			orderStatus: "Cash on Delivery",
// 			orderBy: user._id,
// 		});

// 		const update = userCart.products.map((item) => {
// 			return {
// 				updateOne: {
// 					filter: { _id: item.product },
// 					update: { $inc: { quantity: -item.count, sold: +item.count } },
// 				},
// 			};
// 		});

// 		await Product.bulkWrite(update, {});
// 		res.status(201).json("The order has been successfully!");
// 	} catch (error) {
// 		next(error);
// 	}
// };

exports.getMyOrderCtrl = async (req, res, next) => {
	const { id } = req.user;
	try {
		const orders = await Order.find({ user: id })
			.populate("orderItems.product")
			.populate("orderItems.color", "title")
			.populate("user")
			.sort({ createdAt: -1 });

		if (!orders) {
			return next(new ApiHandler(400, "No order found!"));
		}
		res.status(200).json(orders);
	} catch (error) {
		next(error);
	}
};
exports.getOrderCtrl = async (req, res, next) => {
	const { id } = req.user;
	try {
		validateMongoDbID(id);

		const order = await Order.findOne({ orderBy: id }).populate(
			"products.product"
		);
		if (!order) {
			return next(new ApiHandler(400, "No order found!"));
		}
		res.status(200).json(order);
	} catch (error) {
		next(error);
	}
};

exports.getOrderByUserIdCtrl = async (req, res, next) => {
	const { id } = req.params;
	try {
		validateMongoDbID(id);

		const order = await Order.findOne({ orderBy: id }).populate(
			"products.product"
		);
		if (!order) {
			return next(new ApiHandler(400, "No order found!"));
		}
		res.status(200).json(order);
	} catch (error) {
		next(error);
	}
};

exports.getAllOrdersCtrl = async (req, res, next) => {
	try {
		const orders = await Order.find()
			.populate("products.product")
			.populate("orderBy");
		if (!orders) {
			return next(new ApiHandler(400, "No orders found!"));
		}
		res.status(200).json(orders);
	} catch (error) {
		next(error);
	}
};

exports.updateOrderCtrl = async (req, res, next) => {
	const { status } = req.body;
	const { id } = req.user;
	try {
		const updateOrder = await Order.findOneAndUpdate(
			{ orderBy: id },
			{
				$set: {
					"paymentIntent.status": status,
					orderStatus: status,
				},
			},
			{ new: true }
		);
		if (!updateOrder) {
			return next(new ApiHandler(400, "No order available to update"));
		}
		res.status(200).json(updateOrder);
	} catch (error) {
		next(error);
	}
};
