const {
	createCategoryCtrl,
	getCategoryCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
	getAllCategoryCtrl,
} = require("../controllers/category.ctrl");
const { validateId } = require("../middlewares/validateId");
const { isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/create", isAdmin, createCategoryCtrl);

router.get("/:id", validateId, getCategoryCtrl);
router.put("/:id", validateId, isAdmin, updateCategoryCtrl);
router.delete("/:id", validateId, isAdmin, deleteCategoryCtrl);
router.get("/", getAllCategoryCtrl);

module.exports = router;
