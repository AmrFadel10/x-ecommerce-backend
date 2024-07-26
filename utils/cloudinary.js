const cloudinary = require("cloudinary");

// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
	cloud_name: "dh7ibwhqo",
	api_key: "397564969546264",
	api_secret: "neAssNZrOixrJryEWlxwea4gVYQ",
});

exports.uploadOnCloud = async (realPath) => {
	// return new Promise((resolve) => {
	// 	cloudinary.uploader.upload(
	// 		realPath,
	// 		(result) => {
	// 			resolve({
	// 				url: result.secure_url,
	// 				asset_id: result.asset_id,
	// 				public_id: result.public_id,
	// 			});
	// 		},
	// 		{ resource_type: "auto" }
	// 	);
	// });
	return await cloudinary.uploader.upload(realPath, { resource_type: "auto" });
};

exports.deleteFromCloud = async (publicId) => {
	return await cloudinary.uploader.destroy(publicId);
};
