const Enquiry = require("../models/enquiry.model");
const ApiHandler = require("../utils/ApiHandler");

//create enquiry
exports.createEnquiryCtrl = async (req, res, next) => {
	const { name, email, mobile, comment, status } = req.body;
	try {
		const createEnquiry = await Enquiry.create({
			name,
			email,
			mobile,
			comment,
			status: "Submitted",
		});
		res.status(201).json(createEnquiry);
	} catch (error) {
		next(error);
	}
};

// update enquiry
exports.updateEnquiryCtrl = async (req, res, next) => {
	const { status } = req.body;

	try {
		const findEnquiry = await Enquiry.findById(req.params.id);

		if (!findEnquiry) {
			return next(new ApiHandler(404, "Enquiry not found"));
		}

		const updateteEnquiry = await Enquiry.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					status,
				},
			},
			{ new: true }
		);

		res.status(200).json(updateteEnquiry);
	} catch (error) {
		next(error);
	}
};

//Get enquiry
exports.getEnquiryCtrl = async (req, res, next) => {
	try {
		const findEnquiry = await Enquiry.findById(req.params.id);
		if (!findEnquiry) {
			return next(new ApiHandler(404, "Enquiry not found"));
		}
		res.status(200).json(findEnquiry);
	} catch (error) {
		next(error);
	}
};

//Get all enquiry
exports.getAllEnquiryCtrl = async (req, res, next) => {
	try {
		const enquiries = await Enquiry.find();
		if (enquiries.length === 0) {
			return next(new ApiHandler(404, "No enquiries available"));
		}
		res.status(200).json(enquiries);
	} catch (error) {
		next(error);
	}
};

//delete enquiry
exports.deleteEnquiryCtrl = async (req, res, next) => {
	try {
		const findEnquiry = await Enquiry.findById(req.params.id);

		if (!findEnquiry) {
			return next(new ApiHandler(404, "Enquiry not found"));
		}

		const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

		res.status(200).json(enquiry);
	} catch (error) {
		next(error);
	}
};
