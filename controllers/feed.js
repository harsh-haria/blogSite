const { validationResult } = require("express-validator");

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
    return res.status(422).json({
      message: "Validation Failed! Entered Data is Incorrect :(",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  //save data in DB
  res.status(201).json({
    message: "Post Created Successfully",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: { name: "HarshHaria" },
      createdAt: new Date(),
    },
  });
};
