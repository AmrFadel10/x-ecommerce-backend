const jwt = require("jsonwebtoken");

exports.createActivationToken = (user) => {
	return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//verify activation token;
exports.verifyActivationToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		throw error;
	}
};
