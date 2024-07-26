const {
	createSubCategoryCtrl,
	getSubCategoryCtrl,
	updateSubCategoryCtrl,
	deleteSubCategoryCtrl,
	getAllSubCategoryCtrl,
} = require("../controllers/subCategory.ctrl");
const { validateId } = require("../middlewares/validateId");
const { isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/create", isAdmin, createSubCategoryCtrl);
router.get("/:id", validateId, getSubCategoryCtrl);
router.put("/:id", validateId, isAdmin, updateSubCategoryCtrl);
router.delete("/:id", validateId, isAdmin, deleteSubCategoryCtrl);
router.get("/", getAllSubCategoryCtrl);

module.exports = router;
