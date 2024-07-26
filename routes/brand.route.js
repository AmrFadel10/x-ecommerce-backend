const {
	createBrandCtrl,
	getBrandCtrl,
	updateBrandCtrl,
	deleteBrandCtrl,
	getAllBrandCtrl,
} = require("../controllers/brand.ctrl");
const { validateId } = require("../middlewares/validateId");
const { isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/create", isAdmin, createBrandCtrl);
router.get("/:id", validateId, getBrandCtrl);
router.put("/:id", validateId, isAdmin, updateBrandCtrl);
router.delete("/:id", validateId, isAdmin, deleteBrandCtrl);
router.get("/", getAllBrandCtrl);

module.exports = router;
