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

module.exports = router;
