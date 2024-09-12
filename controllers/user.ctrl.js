const { User } = require("../models/user.model");
const ApiHandler = require("../utils/ApiHandler");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

//Get one user
exports.getUserCtrl = async (req, res, next) => {
	try {
		const findUser = await User.findById(req.params.id);
		if (!findUser) {
			return next(new ApiHandler(404, "User not found"));
		}
		res.status(200).json(findUser);
	} catch (error) {
		next(error);
	}
};

//Get all user
exports.getAllUserCtrl = async (req, res, next) => {
	try {
		const users = await User.find();
		if (!users) {
			return next(new ApiHandler(404, "No Users allowed yet"));
		}
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

//update user
exports.updateUserCtrl = async (req, res, next) => {
	try {
		const findUser = await User.findById(req.user.id);
		if (!findUser) {
			return next(new ApiHandler(404, "User not found"));
		}

		const user = await User.findByIdAndUpdate(
			findUser._id,
			{
				$set: {
					name: req.body.name,
					lastname: req.body.lastName,
					email: req.body.email,
					mobile: req.body.mobile,
				},
			},
			{ new: true }
		);
		if (req.body.password) {
			user.password = req.body.password;
			await user.save();
		}
		user.password = undefined;
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

//delete user
exports.deleteUserCtrl = async (req, res, next) => {
	try {
		const findUser = await User.findById(req.params.id);
		if (!findUser) {
			return next(new ApiHandler(404, "User not found"));
		}
		const user = await User.findByIdAndDelete(req.params.id);
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

//block user
exports.blockUserCtrl = async (req, res, next) => {
	try {
		const findUser = await User.findById(req.params.id);
		if (!findUser) {
			return next(new ApiHandler(404, "User not found"));
		}

		await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					isBlocked: true,
				},
			},
			{ new: true }
		);
		res.status(200).json({ message: "User has been blocked successfully!" });
	} catch (error) {
		next(error);
	}
};

//unblock user
exports.unblockUserCtrl = async (req, res, next) => {
	try {
		const findUser = await User.findById(req.params.id);
		if (!findUser) {
			return next(new ApiHandler(404, "User not found"));
		}

		await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					isBlocked: false,
				},
			},
			{ new: true }
		);
		res.status(200).json({ message: "User has been unblocked successfully!" });
	} catch (error) {
		next(error);
	}
};

//Refresh token
exports.refreshTokenCtrl = async (req, res, next) => {
	const cookie = req.cookies?.refreshToken;
	try {
		if (!cookie) {
			return next(new ApiHandler(404, "No refresh token in cookies"));
		}
		const findUser = await User.findOne({
			refreshToken: cookie,
		});
		if (!findUser) {
			return next(
				new ApiHandler(404, "No user with this refresh token in db ")
			);
		}
		const verify = jwt.verify(cookie, process.env.JWT_SECRET);
		if (!verify || verify.id !== findUser._id.toString()) {
			return next(
				new ApiHandler(
					400,
					"Maybe the refresh token expired, please log in again"
				)
			);
		}
		const accessToken = generateToken(findUser);
		res.status(200).json({ accessToken });
	} catch (error) {
		next(error);
	}
};

//----------------------------------------------------------------------------------------------------//
// add wishlist
//----------------------------------------------------------------------------------------------------//

exports.addWishlistCtrl = async (req, res, next) => {
	const { prodId } = req.body;
	if (!prodId) {
		return next(new ApiHandler(400, "No product id provided!"));
	}
	const userId = req.user.id;

	try {
		let user = await User.findById(userId);

		if (!user) {
			return next(new ApiHandler(400, "This user not found"));
		}
		const checkWishlist = user.wishlist.find(
			(id) => id.toString() === prodId.toString()
		);
		if (checkWishlist) {
			user = await User.findByIdAndUpdate(
				userId,
				{
					$pull: { wishlist: prodId },
				},
				{ new: true }
			);
		} else {
			user = await User.findByIdAndUpdate(
				userId,
				{
					$push: { wishlist: prodId },
				},
				{ new: true }
			);
		}
		return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

//Get wish list
exports.getWishlistCtrl = async (req, res, next) => {
	try {
		const findUser = await User.findById(req.user.id).populate("wishlist");
		if (!findUser) {
			return next(new ApiHandler(404, "User not found"));
		}
		res.status(200).json(findUser);
	} catch (error) {
		next(error);
	}
};

//compare products
exports.addCompareProductsCtrl = async (req, res, next) => {
	const { prodId } = req.body;
	console.log(req.body);

	const userId = req.user.id;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return next(new ApiHandler(404, "User not found"));
		}
		let compare = user.compareProducts.find(
			(ele) => ele.toString() === prodId.toString()
		);
		if (compare) {
			compare = await User.findByIdAndUpdate(
				userId,
				{
					$pull: { compareProducts: prodId },
				},
				{ new: true }
			);
		} else {
			compare = await User.findByIdAndUpdate(
				userId,
				{
					$push: { compareProducts: prodId },
				},
				{ new: true }
			);
		}
		res.status(200).json(compare);
	} catch (error) {
		next(error);
	}
};

//Get compare products
exports.getCompareProducts = async (req, res, next) => {
	try {
		let user = await User.findById(req.user.id).populate("compareProducts");
		if (!user) {
			return next(new ApiHandler(404, "User not found"));
		}
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

//save address

exports.saveAddressCtrl = async (req, res, next) => {
	try {
		let user = await User.findById(req.user.id);
		if (!user) {
			return next(new ApiHandler(404, "User not found"));
		}
		user = await User.findByIdAndUpdate(
			req.user.id,
			{
				$set: { address: req.body.address },
			},
			{ new: true }
		);
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};
