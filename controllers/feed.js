const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");
const post = require("../models/post");

const Post = require("../models/post");
const User = require("../models/user");

//starting with node --v 14 we can use await outside a async function
//it is called top-level await
//however we need to write async at the top of function while using await inside it

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find the post!");
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({ message: "Post fetched!", post: post });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed! Entered Data is Incorrect :(");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("Image not provided!");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/"); //for Windows
  // const imageUrl = req.file.path; //for linux or mac
  let creator;
  const title = req.body.title;
  const content = req.body.content;
  //save data in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  try {
    let result = await post.save();
    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(post);
    result = await user.save();

    res.status(201).json({
      message: "Post Created Successfully!",
      post: post,
      creator: {
        _id: creator._id,
        name: creator.name,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed! Entered Data is Incorrect :(");
    error.statusCode = 422;
    throw error;
  }
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    const error = new Error("No file Picked!");
    error.statusCode = 422;
    throw error;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("No post found!");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not Authorized");
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const postSaver = await post.save();
    res
      .status(200)
      .json({ message: "Post Edited Successfully!", post: postSaver });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("No post found!");
    error.statusCode = 404;
    throw error;
  }
  if (post.creator.toString() !== req.userId) {
    const error = new Error("Not Authorized");
    error.statusCode = 403;
    throw error;
  }
  clearImage(post.imageUrl);
  try {
    const result1 = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    const userSaver = await user.save();
    res.status(200).json({ message: "The post was deleted!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.fetchStatus = async (req, res, next) => {
  const userId = req.userId;
  let status;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("No user found!");
      error.statusCode = 404;
      throw error;
    }
    status = user.status;
    res.status(200).json({ status: status });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("No user found!");
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    const userSave = await user.save();
    res.status(200).json({ message: "User Status Updated", Status: newStatus });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
