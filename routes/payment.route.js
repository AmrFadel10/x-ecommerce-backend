const {
	paymentProcessCtrl,
	getApiStripeCtrl,
} = require("../controllers/payment.ctrl");

const router = require("express").Router();

router.post("/process", paymentProcessCtrl);
router.get("/get-stripe-api-key", getApiStripeCtrl);

module.exports = router;
