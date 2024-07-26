const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	let token = req.headers?.authorization;
	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied, no token privided" });
	}
	try {
		const encoded = token?.split(" ")[1];

		const verify = jwt.verify(encoded, process.env.JWT_SECRET);
		// if (!verify) {
		// 	return res
		// 		.status(403)
		// 		.json({ message: "Access denied, user himself do that!" });
		// }
		req.user = verify;
		next();
	} catch (error) {
		return res.status(401).json({ message: error.message });
	}
};
// const verifyToken1 = (req, res, next) => {
// 	let token = req.headers?.authorization;
// 	console.log(token);
// 	if (!token?.split(" ")[1]) {
// 		return res
// 			.status(401)
// 			.json({ message: "Access denied, no token provided" });
// 	}

// 	const encoded = token?.split(" ")[1];
// 	try {
// 		const verify = jwt.verify(encoded, process.env.JWT_SECRET);
// 		if (!verify) {
// 			return res
// 				.status(403)
// 				.json({ message: "Access denied, token is invalid or expired" });
// 		}
// 		req.user = verify;
// 		next();
// 	} catch (error) {
// 		if (error.name === "JsonWebTokenError") {
// 			return res
// 				.status(403)
// 				.json({ message: "Access denied, token is malformed" });
// 		}
// 		next(error);
// 	}
// };

const isAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user?.role !== "admin") {
			return res
				.status(403)
				.json({ message: "Access denied, Just for Admin!" });
		}
		next();
	});
};

module.exports = {
	isAdmin,
	verifyToken,
};
