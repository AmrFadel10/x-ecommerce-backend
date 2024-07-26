const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		mobile: {
			type: String,
			required: true,
		},
		comment: {
			type: String,
			minLength: 20,
			required: true,
		},
		status: {
			type: String,
			default: "Submitted",
			enum: ["Submitted", "Contacted", "In progress", "Resolved"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
