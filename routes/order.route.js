const {
	createOrderCtrl,
	getOrderCtrl,
	updateOrderCtrl,
	getAllOrdersCtrl,
	getOrderByUserIdCtrl,
	getMyOrderCtrl,
} = require("../controllers/order.ctrl");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router
	.route("/")
	.get(verifyToken, getOrderCtrl)
	.post(verifyToken, createOrderCtrl)
	.put(isAdmin, updateOrderCtrl);

router.route("/get-my-order").get(verifyToken, getMyOrderCtrl);
router.route("/get-order-by-user-id/:id").get(isAdmin, getOrderByUserIdCtrl);
router.route("/all").get(isAdmin, getAllOrdersCtrl);
module.exports = router;
