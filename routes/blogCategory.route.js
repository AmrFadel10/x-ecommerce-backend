const {
	createBlogCategoryCtrl,
	getBlogCategoryCtrl,
	updateBlogCategoryCtrl,
	deleteBlogCategoryCtrl,
	getAllBlogCategoryCtrl,
} = require("../controllers/blogCategory.ctrl");
const { validateId } = require("../middlewares/validateId");
const { isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/create", isAdmin, createBlogCategoryCtrl);
router.get("/:id", validateId, getBlogCategoryCtrl);
router.put("/:id", validateId, isAdmin, updateBlogCategoryCtrl);
router.delete("/:id", validateId, isAdmin, deleteBlogCategoryCtrl);
router.get("/", getAllBlogCategoryCtrl);

module.exports = router;
