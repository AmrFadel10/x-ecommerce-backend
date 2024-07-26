const {
	createBlogCtrl,
	updateBlogCtrl,
	deleteBlogCtrl,
	getBlogCtrl,
	likeBlogCtrl,
	dislikeBlogCtrl,
	getAllBlogCtrl,
	uploadImagesCtrl,
} = require("../controllers/blog.ctrl");
const uploadPhoto = require("../middlewares/multer");
const { validateId } = require("../middlewares/validateId");
const { isAdmin, verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/create", isAdmin, uploadPhoto.single("image"), createBlogCtrl);
router.put("/likes", verifyToken, likeBlogCtrl);
router.put("/dislikes", verifyToken, dislikeBlogCtrl);
router.put(
	"/upload/:id",
	isAdmin,
	uploadPhoto.array("images", 10),
	uploadImagesCtrl
);

router.get("/:id", validateId, getBlogCtrl);
router.put("/:id", validateId, updateBlogCtrl);
router.delete("/:id", validateId, deleteBlogCtrl);
router.get("/", getAllBlogCtrl);

module.exports = router;
