const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		shippingInfo: {
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
			},
			address: {
				type: String,
				required: true,
			},
			city: {
				type: String,
				required: true,
			},
			state: {
				type: String,
				required: true,
			},
			pineCode: {
				type: String,
				required: true,
			},
			other: {
				type: String,
				required: true,
			},
		},
		paymentInfo: {
			id: {
				type: String,
				required: true,
			},
			status: {
				type: String,
				required: true,
			},
			type: {
				type: String,
				required: true,
			},
		},
		orderItems: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				color: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Color",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		paidAt: {
			type: Date,
			default: Date.now(),
		},
		totalPrice: {
			type: String,
			required: true,
		},
		totalPriceAfterDiscount: {
			type: String,
			required: true,
		},
		orderStatus: {
			type: String,
			default: "ordered",
			enum: [
				"ordered",
				"Not Processed",
				"Processing",
				"Dispatched",
				"cancelled",
				"Delivered",
			],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
