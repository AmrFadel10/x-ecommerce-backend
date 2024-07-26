const {
	getProductCtrl,
	updateProductCtrl,
	deleteProductCtrl,
	createProductCtrl,
	getAllProductsCtrl,
	ratingCtrl,
	uploadImagesCtrl,
	deleteImageCtrl,
} = require("../controllers/product.ctrl");
const uploadPhoto = require("../middlewares/multer");
const { validateId } = require("../middlewares/validateId");
const { isAdmin, verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/", getAllProductsCtrl);
router.post(
	"/create",
	isAdmin,
	uploadPhoto.array("images", 10),
	createProductCtrl
);
router.put("/rating", verifyToken, ratingCtrl);

router.post(
	"/upload-img",
	isAdmin,
	uploadPhoto.array("images", 10),
	uploadImagesCtrl
);
router.delete("/delete-img/:id", isAdmin, deleteImageCtrl);
// if will check with slug wh should remove
router.get("/:id", validateId, getProductCtrl);
router.put("/:id", validateId, isAdmin, updateProductCtrl);
router.delete("/:id", validateId, isAdmin, deleteProductCtrl);

module.exports = router;
