const {
	createColorCtrl,
	getColorCtrl,
	updateColorCtrl,
	deleteColorCtrl,
	getAllColorCtrl,
} = require("../controllers/color.ctrl");
const { validateId } = require("../middlewares/validateId");
const { isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/create", isAdmin, createColorCtrl);
router.get("/:id", validateId, getColorCtrl);
router.put("/:id", validateId, isAdmin, updateColorCtrl);
router.delete("/:id", validateId, isAdmin, deleteColorCtrl);
router.get("/", getAllColorCtrl);

module.exports = router;
