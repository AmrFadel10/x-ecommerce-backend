const jwt = require("jsonwebtoken");

exports.refreshToken = (user) => {
	const token = jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "3d" }
	);
	return token;
};
