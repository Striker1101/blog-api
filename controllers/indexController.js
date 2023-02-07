const Posts = require("../models/posts");
exports.index = (req, res, next) => {
  Posts.find({ publish: true }).exec(function (err, posts) {
    if (err) {
      next(err);
    }
    if (!posts.length > 0) {
      res
        .json([
          { message: "no posts",}
        ])
        .status(404);
        return;
    }
    res 
      .json({ 
        posts,   
      }) 
      .status(200);
  });
};

exports.all = (req, res, next) => {
  Posts.find({}).exec(function (err, posts) {
    if (err) {
      next(err);
    }
    if (!posts.length > 0) {
      res
        .json({
          message: "no posts",
        })
        .status(404);
    }
    res 
      .json({ 
        posts,
      })
      .status(200);  
  });
};
