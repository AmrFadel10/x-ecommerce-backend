const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const ApiHandler = require("../utils/ApiHandler");
const Product = require("../models/product.model");
const { uploadOnCloud, deleteFromCloud } = require("../utils/cloudinary");
const { default: mongoose } = require("mongoose");

//----------------------------------------------------------------------------------------------------//
//create product
//----------------------------------------------------------------------------------------------------//

exports.createProductCtrl = async (req, res, next) => {
  const { title, description, price, brand, category, quantity, sold, color } =
    req.body;
  let colors = JSON.parse(color).map((ele) => new mongoose.Types.ObjectId(ele));
  console.log(req.body);
  try {
    if (!req.files) {
      return next(new ApiHandler(400, "No images provided!"));
    }
    const findProduct = await Product.findOne({ title });

    if (findProduct) {
      return next(new ApiHandler(400, "Product already exists"));
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    let arr = [];
    for (let file of req.files) {
      let obj = {};

      const result = await uploadOnCloud(file.path);
      obj.url = result.url;
      obj.public_id = result.public_id;
      arr.push(obj);
    }
    const createProduct = await Product.create({
      title,
      description,
      price,
      brand,
      category,
      quantity,
      sold,
      color: colors,
      slug: req.body.slug,
      images: arr,
    });
    res.status(201).json(createProduct);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------//
//get all products
//----------------------------------------------------------------------------------------------------//

exports.getAllProductsCtrl = async (req, res, next) => {
  try {
    //1)filteration
    const qu = { ...req.query };
    //exception some words
    const exeptWords = ["page", "fields", "sort", "limit", "select"];
    exeptWords.forEach((item) => delete qu[item]);
    const quString = JSON.stringify(qu);
    const editing1 = quString.replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`
    );
    const editing2 = JSON.parse(editing1.replace("+", " "));

    console.log(editing2);
    let products = Product.find(editing2);

    //2)Pagination
    const limit = +req.query.limit || 100;
    const page = +req.query.page || 1;
    const skip = (page - 1) * limit || 0;

    products.limit(limit).skip(skip);

    //3)Sorting
    const sort = req.query.sort?.split(",").join(" ") || "createdAt";
    products.sort(sort);

    //4)selection
    const select = req.query.select?.split(",").join(" ") || "-__v";
    products.select(select);

    last = await products.populate("color");
    res.status(200).json(last);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------//
// update product
//----------------------------------------------------------------------------------------------------//

exports.updateProductCtrl = async (req, res, next) => {
  const { title, description, price, brand, category, quantity, sold, color } =
    req.body;

  try {
    const findProduct = await Product.findById(req.params.id);

    if (!findProduct) {
      return next(new ApiHandler(404, "Product not found"));
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updateteProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          description,
          price,
          brand,
          category,
          quantity,
          sold,
          color,
          slug: req.body.slug,
        },
      },
      { new: true }
    );

    res.status(200).json(updateteProduct);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------//
//Get product
//----------------------------------------------------------------------------------------------------//

exports.getProductCtrl = async (req, res, next) => {
  try {
    const findProduct = await Product.findById(req.params.id).populate("color");
    if (!findProduct) {
      return next(new ApiHandler(404, "Product not found"));
    }
    res.status(200).json(findProduct);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------//
//delete product
//----------------------------------------------------------------------------------------------------//

exports.deleteProductCtrl = async (req, res, next) => {
  try {
    const findProduct = await Product.findById(req.params.id);
    if (!findProduct) {
      return next(new ApiHandler(404, "Product not found"));
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------//
// Make rating
//----------------------------------------------------------------------------------------------------//
exports.ratingCtrl = async (req, res, next) => {
  const userId = req.user.id;
  const { comment, star, prodId } = req.body;

  try {
    if (star < 1 || star > 5) {
      return res
        .status(400)
        .json({ message: "Invalid star value. Must be between 1 and 5." });
    }

    let product = await Product.findById(prodId);
    if (!product) {
      return next(new ApiHandler(404, "This product not found"));
    }
    let checkRating = product.ratings.find(
      (item) => item.postedby.toString() === userId.toString()
    );
    if (checkRating) {
      await Product.updateOne(
        { ratings: { $elemMatch: checkRating } },
        {
          $set: { "ratings.$": { comment, star } },
        },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: { ratings: { postedby: userId, comment, star } },
        },
        { new: true }
      );
    }

    product = await Product.findById(prodId);

    const totalratings = product.ratings
      .map((item) => item.star)
      .reduce((acc, cur) => acc + cur, 0);

    const numsRating = product.ratings.length;

    const avg = totalratings / numsRating;
    product = await Product.findByIdAndUpdate(
      prodId,
      {
        $set: { totalrating: avg },
      },
      { new: true }
    );
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------//
// Uplaod images
//----------------------------------------------------------------------------------------------------//

exports.uploadImagesCtrl = async (req, res, next) => {
  let urls = [];
  try {
    if (!req.files) {
      return next(new ApiHandler(400, "No images provided to save!"));
    }
    console.log(req.files);
    for (const file of req.files) {
      const url = await uploadOnCloud(file.path);
      urls.push({
        url: url.secure_url,
        asset_id: url.asset_id,
        public_id: url.public_id,
      });
      fs.unlinkSync(file.path);
    }

    res.status(200).json({ images: urls });
  } catch (error) {
    next(error);
  }
};

//----------------------------------------------------------------------------------------------------//
// delete image
//----------------------------------------------------------------------------------------------------//

exports.deleteImageCtrl = async (req, res, next) => {
  const { id } = req.params;
  try {
    await deleteFromCloud(id);

    res.status(200).json({ message: "Image has been deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
