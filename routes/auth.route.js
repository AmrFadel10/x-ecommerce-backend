const express = require("express");
const {
	logoutCtrl,
	loginAdminCtrl,
	createUserCtrl,
	verifyAccountCtrl,
	loginUserCtrl,
	getUserCtrl,
	resetPasswordCtrl,
	forgotPasswordCtrl,
} = require("../controllers/auth.ctrl");
const router = express.Router();

const { isUserAuth } = require("../middlewares/auth");
const uploadPhoto = require("../middlewares/multer");
//Signup route
router.post("/signup", uploadPhoto.single("image"), createUserCtrl);
router.post("/login", loginUserCtrl);
router.post("/activation", verifyAccountCtrl);
router.get("/getuser", isUserAuth, getUserCtrl);
router.post("/admin-login", loginAdminCtrl);
router.get("/logout", logoutCtrl);
router.post("/forgot-password", forgotPasswordCtrl);
router.post("/reset-password/:token", resetPasswordCtrl);

module.exports = router;
