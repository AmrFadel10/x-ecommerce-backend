const {
	createCouponCtrl,
	updateCouponCtrl,
	getCouponCtrl,
	getAllCouponCtrl,
	deleteCouponCtrl,
} = require("../controllers/coupon.ctrl");
const { isAdmin } = require("../middlewares/verifyToken");

const { validateId } = require("../middlewares/validateId");

const router = require("express").Router();

router.post("/create", isAdmin, createCouponCtrl);
router.get("/:id", getCouponCtrl);
router.put("/:id", validateId, isAdmin, updateCouponCtrl);
router.delete("/:id", validateId, isAdmin, deleteCouponCtrl);
router.get("/", isAdmin, getAllCouponCtrl);

module.exports = router;
