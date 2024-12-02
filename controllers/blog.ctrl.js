const Blog = require("../models/blog.model");
const ApiHandler = require("../utils/ApiHandler");
const fs = require("fs");
const { uploadOnCloud } = require("../utils/cloudinary");

//-----------------------------------------------------------------------------------//
//create a new blog
//-----------------------------------------------------------------------------------//

exports.createBlogCtrl = async (req, res, next) => {
  if (!req.file) {
    return next(new ApiHandler(400, "No image provided!"));
  }

  const result = await uploadOnCloud(req.file.path);

  const { title, description, category } = req.body;
  try {
    const checkBlog = await Blog.findOne({ title });
    if (checkBlog) {
      return next(new ApiHandler(400, "This title already exist!"));
    }
    const blog = await Blog.create({
      title,
      description,
      category,
      image: { url: result.url, publicId: result.public_id },
    });

    return res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------//
//get a blog
//-----------------------------------------------------------------------------------//

exports.getBlogCtrl = async (req, res, next) => {
  try {
    const updateBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    return res.status(200).json(updateBlog);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------//
//Get all blog
//-----------------------------------------------------------------------------------//

exports.getAllBlogCtrl = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("likes").populate("dislikes");
    if (blogs.length === 0) {
      return next(new ApiHandler(404, "No Blogs allowed yet"));
    }
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//-----------------------------------------------------------------------------------//
// update blog
//-----------------------------------------------------------------------------------//

exports.updateBlogCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;

  try {
    const findBlog = await Blog.findById(req.params.id);

    if (!findBlog) {
      return next(new ApiHandler(404, "Blog not found"));
    }

    const updateteBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $set: { title, description, category },
      },
      { new: true }
    );

    res.status(200).json(updateteBlog);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------//
//delete blog
//-----------------------------------------------------------------------------------//

exports.deleteBlogCtrl = async (req, res, next) => {
  try {
    const checkBlog = await Blog.findOne(req.params.id);

    if (!checkBlog) {
      return next(new ApiHandler(404, "This Blog doesn't exist"));
    }
    const blog = await Blog.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "This blog has been deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------//
//like blog
//-----------------------------------------------------------------------------------//

exports.likeBlogCtrl = async (req, res, next) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id.toString();
    let blog = await Blog.findById(blogId);
    if (!blog) {
      return next(new ApiHandler(404, "The Blog not found"));
    }
    const isLike = blog.isLiked;
    const isDisLiked = blog.dislikes.find((e) => e.toString() === userId);
    if (isDisLiked) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: userId },
          isDisLiked: false,
        },
        { new: true }
      );
    }
    if (isLike) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: userId },
          isLiked: false,
        },
        { new: true }
      );
    } else {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: userId },
          isLiked: true,
        },
        { new: true }
      );
    }

    return res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------------------------------------------//
//dislike blog
//-----------------------------------------------------------------------------------//

exports.dislikeBlogCtrl = async (req, res, next) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id.toString();

    //check if the blog is already exist
    let blog = await Blog.findById(blogId);
    if (!blog) {
      return next(new ApiHandler(404, "The Blog not found"));
    }
    const isDislike = blog.isDisLiked;
    const isLiked = blog.likes.find((e) => e.toString() === userId);
    console.log(isLiked);
    if (isLiked) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: userId },
          isLiked: false,
        },
        { new: true }
      );
    }
    if (isDislike) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: userId },
          isDisLiked: false,
        },
        { new: true }
      );
    } else {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: userId },
          isDisLiked: true,
        },
        { new: true }
      );
    }

    return res.status(200).json(blog);
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
    for (const file of req.files) {
      const url = await uploadOnCloud(file.path);
      urls.push(url);
      fs.unlinkSync(file.path);
    }
    console.log(urls);
    const uploadedImages = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $set: { images: urls },
      },
      { new: true }
    );
    res.status(200).json(uploadedImages);
  } catch (error) {
    next(error);
  }
};
