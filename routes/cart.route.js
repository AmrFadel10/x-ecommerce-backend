const {
	applyCouponCtrl,
	emptyCartCtrl,
	setUserCartCtrl,
	getUserCartCtrl,
	updateProductFromCartCtrl,
	deleteProductFromCartCtrl,
} = require("../controllers/cart.ctrl");
const { verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

router
	.route("/")
	.get(verifyToken, getUserCartCtrl)
	.post(verifyToken, setUserCartCtrl);

router
	.route("/:cartId")
	.put(verifyToken, updateProductFromCartCtrl)
	.delete(verifyToken, deleteProductFromCartCtrl);
router.route("/empty").delete(verifyToken, emptyCartCtrl);

router.route("/apply-coupon").post(verifyToken, applyCouponCtrl);

module.exports = router;
