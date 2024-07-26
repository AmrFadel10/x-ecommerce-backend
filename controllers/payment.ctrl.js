const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.paymentProcessCtrl = async (req, res, next) => {
	try {
		const myPayment = await stripe.paymentIntents.create({
			amount: req.body.amount,
			currency: "egp",
			metadata: {
				company: "Mora",
			},
		});
		res.status(201).json({ client_secret: myPayment.client_secret });
	} catch (error) {
		next(error);
	}
};

//get api key for stripe
exports.getApiStripeCtrl = async (req, res, next) => {
	try {
		res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
	} catch (error) {
		next(error);
	}
};
