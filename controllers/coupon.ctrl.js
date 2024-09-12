const Coupon = require("../models/coupon.model");
const ApiHandler = require("../utils/ApiHandler");

//create coupon
exports.createCouponCtrl = async (req, res, next) => {
  const { name, expiry, discount } = req.body;
  try {
    const findCoupon = await Coupon.findOne({ name });

    if (findCoupon) {
      return next(new ApiHandler(400, "Coupon already exists"));
    }
    const createCoupon = await Coupon.create({
      name,
      expiry,
      discount,
    });
    res.status(201).json(createCoupon);
  } catch (error) {
    next(error);
  }
};

// update coupon
exports.updateCouponCtrl = async (req, res, next) => {
  const { name, expiry, discount } = req.body;

  try {
    const findCoupon = await Coupon.findById(req.params.id);

    if (!findCoupon) {
      return next(new ApiHandler(404, "Coupon not found"));
    }

    const updateteCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          expiry,
          discount,
        },
      },
      { new: true }
    );

    res.status(200).json(updateteCoupon);
  } catch (error) {
    next(error);
  }
};

//Get coupon
exports.getCouponCtrl = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const findCoupon = await Coupon.findById(req.params.id);
    if (!findCoupon) {
      return next(new ApiHandler(404, "Coupon not found"));
    }
    res.status(200).json(findCoupon);
  } catch (error) {
    next(error);
  }
};

//Get all coupon
exports.getAllCouponCtrl = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    if (coupons.length === 0) {
      return next(new ApiHandler(404, "No coupons available"));
    }
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

//delete coupon
exports.deleteCouponCtrl = async (req, res, next) => {
  try {
    const findCoupon = await Coupon.findById(req.params.id);

    if (!findCoupon) {
      return next(new ApiHandler(404, "Coupon not found"));
    }

    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};
