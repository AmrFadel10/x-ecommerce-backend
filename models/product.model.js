const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			min: 2,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		description: {
			type: String,
			required: true,
			min: 70,
		},
		price: {
			type: Number,
			required: true,
		},
		brand: {
			type: String,
			required: true,
			minLength: 2,
		},
		category: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		sold: {
			type: Number,
			default: 0,
		},
		images: {
			type: [
				{
					url: { type: String, required: true },
					public_id: { type: String, required: true },
				},
			],
			required: true,
		},
		color: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Color",
			},
		],

		ratings: [
			{
				star: { type: Number, min: 1, max: 5 },
				comment: String,
				postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			},
		],
		totalrating: {
			type: String,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Product =
	mongoose.models?.Product || mongoose.model("Product", productSchema);
module.exports = Product;
