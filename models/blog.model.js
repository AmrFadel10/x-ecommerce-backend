const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			minLength: 2,
		},
		description: {
			type: String,
			required: true,
			minLength: 50,
		},
		category: {
			type: String,
			required: true,
		},
		numViews: {
			type: Number,
			default: 0,
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		isDisLiked: {
			type: Boolean,
			default: false,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		image: {
			type: {
				url: { type: String, required: true },
				publicId: { type: String, required: true },
			},
		},
		auth: {
			type: String,
			default: "admin",
		},
	},
	{ timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
