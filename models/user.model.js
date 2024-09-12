const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name!"],
			minLength: 2,
		},
		lastname: {
			type: String,
		},
		email: {
			type: String,
			required: [true, "Please enter your email!"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please enter your password"],
			minLength: [6, "Password should be greater than 6 characters"],
			select: false,
		},
		avatar: {
			public_id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: [true, "Please enter your photo"],
			},
		},
		mobile: {
			type: String,
			// required: true,
			// unique: true,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		cart: {
			type: Array,
			default: [],
		},
		addresses: [
			{
				country: {
					type: String,
				},
				city: {
					type: String,
				},
				address: {
					type: String,
				},

				pineCode: {
					type: Number,
				},
				addressType: {
					type: String,
				},
			},
		],
		wishlist: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		compareProducts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Number,
	},
	{ timestamps: true }
);

//Hash password before save it
userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
});

// jwt token
userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};
// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min
	return resetToken;
};

const User = mongoose?.models?.User || mongoose.model("User", userSchema);

module.exports = { User };
