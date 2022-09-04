exports.getPosts = (req,res,next) => {
    res.status(200).json({
      posts: [{ title: "first post", content: "This is the first post" }],
    });
};

exports.createPost = (req,res,next) => {
    const title = req.body.title;
    const content = req.body.content;
    //save data in DB
    res.status(201).json({
      message: "Post Created Successfully",
      post: { id: new Date().toISOString(), title: title, content: content },
    });
};