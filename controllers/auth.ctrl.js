const { User } = require("../models/user.model");
const ApiHandler = require("../utils/ApiHandler");
const crypto = require("crypto");

// const { generateToken } = require("../utils/generateToken");
const { refreshToken } = require("../utils/refreshToken");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { createActivationToken } = require("../utils/tokens");
const sendMail = require("../utils/nodemailer");
const { uploadOnCloud } = require("../utils/cloudinary");

exports.createUserCtrl = async (req, res, next) => {
  const { fullname, password, email } = req.body;
  try {
    if (!req.file) {
      return next(new ApiHandler(400, "Enter you photo please!"));
    }
    const user = await User.findOne({ email });
    if (user) {
      const des = path.join(__dirname, "../assets/images", req.file.filename);
      fs.unlinkSync(des);
      return next(new ApiHandler(400, "This user already exists"));
    }
    const realPath = req.file.path;
    const result = await uploadOnCloud(realPath);
    const token = createActivationToken({
      email,
      password,
      name: fullname,
      public_id: result.public_id,
      url: result.secure_url,
    });
    const activationLink = `http://localhost:5173/activation/${token}`;

    await sendMail({
      email,
      subject: "Activation account!",
      text: `Hello ${fullname}, please click on the link to activate you account: ${activationLink}`,
    });
    res.status(200).json({
      success: true,
      message: `Please check you email:${email} to verify your account!`,
    });
    fs.unlinkSync(realPath);
  } catch (error) {
    next(error);
  }
};

//verification account

exports.verifyAccountCtrl = async (req, res, next) => {
  const { activationToken } = req.body;
  try {
    const verifyToken = jwt.verify(activationToken, process.env.JWT_SECRET);
    if (!verifyToken) {
      return next(new ApiHandler(400, "Invalid Token, access denied!"));
    }
    const user = await User.findOne({ email: verifyToken.email });

    if (user) {
      return next(new ApiHandler(400, "This user already exists"));
    }
    const newUser = await User.create({
      email: verifyToken.email,
      password: verifyToken.password,
      name: verifyToken.name,
      avatar: {
        public_id: verifyToken.public_id,
        url: verifyToken.url,
      },
    });
    const token = newUser.getJwtToken();
    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        user: newUser,
        token,
        message: "Account created Successfully!",
      });
  } catch (error) {
    next(error);
  }
};

//Login
exports.loginUserCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new ApiHandler(400, "Please fill all fields!"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiHandler(404, "Email or password is wrong!"));
    }
    if (!(await user.comparePassword(password))) {
      return next(new ApiHandler(404, "Email or password is wrong!"));
    }
    const token = user.getJwtToken();
    user.password = undefined;
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        user,
        token,
      });
  } catch (error) {
    next(error);
  }
};

//get user

exports.getUserCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ApiHandler(400, "User doesn't exists"));
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------//
//Logout user
//-----------------------------------------------------//

exports.logoutCtrl = async (req, res, next) => {
  const cookie = req.cookies?.refreshToken;
  try {
    if (cookie) {
      const user = await User.findOne({
        refreshToken: cookie,
      });
      if (user) {
        await User.findOneAndUpdate(
          { refreshToken: cookie },
          {
            $set: { refreshToken: "" },
          },
          { new: true }
        );
      }
      return res
        .clearCookie("refreshToken", {
          httpOnly: true,
        })
        .sendStatus(204);
    } else {
      return next(new ApiHandler(400, "You already logout"));
    }
  } catch (error) {
    next(error);
  }
};

//-----------------------------------///
//log-in Admin
//-----------------------------------///

exports.loginAdminCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email }).select("+password");
    if (!admin) {
      return next(new ApiHandler(400, "Invalid credentials"));
    }
    if (admin?.role !== "admin") {
      return next(new ApiHandler(400, "Not authorized (Just admins)"));
    }
    if (!(await admin.comparePassword(password))) {
      return next(new ApiHandler(400, "Invalid credentials"));
    }
    // const token =  generateToken(admin);
    const token = refreshToken(admin);
    admin.refreshToken = token;
    await admin.save();
    admin.password = undefined;
    res
      .status(200)
      .cookie("refreshToken", token, {
        maxAge: 72 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({ admin, token });
  } catch (error) {
    next(error);
  }
};

//-----------------------------------///
// Forgot password
//-----------------------------------///

exports.forgotPasswordCtrl = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiHandler(400, "No user with this email!"));
    }

    const token = user.createPasswordResetToken();
    await user.save();
    await sendMail({
      email,
      subject: "Forgot password",
      // text: "Hello!",
      htm: `<div>To reset you password. you must be click on this link <a href="http://localhost:5173/reset-password/${token}">Click here</a></div>`,
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
//-----------------------------------///
// Reset password
//-----------------------------------///

exports.resetPasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new ApiHandler(400, "Token expired, please try again later!")
      );
    }

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.password = password;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// //-----------------------------------///
// //sign-up
// //-----------------------------------///

// exports.registerCtrl = async (req, res, next) => {
// 	const body = req.body;
// 	try {
// 		//check if email exists
// 		const findByEmail = await User.findOne({ email: body.email });

// 		if (findByEmail) {
// 			return next(new ApiHandler(400, "This Email already exists"));
// 		}

// 		//check if mobile exists
// 		const findByMobile = await User.findOne({ mobile: body.mobile });

// 		if (findByMobile) {
// 			return next(new ApiHandler(400, "This Mobile already exists"));
// 		}

// 		const user = await User.create({
// 			firstname: body.firstname,
// 			lastname: body.lastname,
// 			mobile: body.mobile,
// 			email: body.email,
// 			password: body.password,
// 		});
// 		user.password = undefined;
// 		res.status(201).json(user);
// 	} catch (error) {
// 		next(error);
// 	}
// };

// //-----------------------------------///
// //log-in user
// //-----------------------------------///

// exports.loginCtrl = async (req, res, next) => {
// 	const { email, password } = req.body;
// 	try {
// 		const user = await User.findOne({ email }).select("+password");
// 		if (!user || !(await user.isPasswordMatched(password))) {
// 			return next(new ApiHandler(400, "Invalid credentials"));
// 		}
// 		// const token =  generateToken(user);
// 		const token = refreshToken(user);
// 		user.refreshToken = token;
// 		await user.save();
// 		res
// 			.status(200)
// 			.cookie("refreshToken", token, {
// 				maxAge: 72 * 60 * 60 * 1000,
// 				httpOnly: true,
// 			})
// 			.json({ user, token });
// 	} catch (error) {
// 		next(error);
// 	}
// };
