const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
		quantity: { type: Number, required: true },
		color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
