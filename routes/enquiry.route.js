const {
	createEnquiryCtrl,
	getEnquiryCtrl,
	updateEnquiryCtrl,
	deleteEnquiryCtrl,
	getAllEnquiryCtrl,
} = require("../controllers/enquiry.ctrl");
const { validateId } = require("../middlewares/validateId");
const { isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/create", createEnquiryCtrl);
router.get("/:id", validateId, getEnquiryCtrl);
router.put("/:id", validateId, isAdmin, updateEnquiryCtrl);
router.delete("/:id", validateId, isAdmin, deleteEnquiryCtrl);
router.get("/", isAdmin, getAllEnquiryCtrl);

module.exports = router;
