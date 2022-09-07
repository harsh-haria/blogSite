const { validationResult } = require("express-validator");
const post = require("../models/post");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "first post",
        content: "This is the first post",
        imageUrl: "images/ducky.jpg",
        creator: {
          name: "Harsh",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed! Entered Data is Incorrect :(");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  //save data in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/ducky.jpg",
    creator: { name: "HarshHaria" },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post Created Successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
