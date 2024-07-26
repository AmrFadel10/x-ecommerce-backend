const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const des = path.join(__dirname, "../assets/images");
		cb(null, des);
	},
	filename: function (req, file, cb) {
		const suffix =
			new Date().toISOString().replace(/:/g, "-") +
			"-" +
			Math.random() * 1e9 +
			file.originalname;
		cb(null, suffix);
	},
});

// upload Photo middleware
const uploadPhoto = multer({
	storage,
	fileFilter: function (req, file, cb) {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb("just accept images", false);
		}
	},
	limits: {
		fileSize: 1024 * 1024 * 3,
	},
});

module.exports = uploadPhoto;
