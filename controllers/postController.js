const { body, validationResult } = require("express-validator");
const Comments = require("../models/comments");
const Post = require("../models/posts");

exports.posts_get = (req, res, next) => {
  Post.findById(req.params.postId).exec(function (err, details) {
    if (err) {
      return next(err);
    }
    if (details == null) {
      res.status(404);
      return;
    }
    res.json({
      post: details,
    });
  });
};

exports.comment_one_get = (req, res, next) => {
  Comments.findById(req.params.commentID).exec(function (err, details) {
    if (err) {
      return next(err);
    }
    if (details == null) {
      res.status(404);
      return;
    }
    res.json({
      details,
    });
  });
};

exports.comments_get = (req, res, next) => {
  Comments.find({ commentID: req.params.post }).exec(function (err, comments) {
    if (err) {
      next(err);
    }
    res.json({
      comments,
    });
  });
};

exports.posts_post = [
  body("title", "title must be included").isLength({ min: 1 }).trim().escape(),
  body("summary", " must contain a descriptive message of more than 15 words")
    .isLength({ min: 10 })
    .trim()
    .escape(),
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const { title, summary, publish } = req.body;
    const post = new Post({
      title,
      summary,
      publish,
      date: new Date(),
    });
    if (!errors.isEmpty()) {
      // there is an error
      res
        .json({
          errors: errors.array(),
        })
        .status(400);
      return;
    }
    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: "ok" }).status(200);
    });
  },
];

exports.comments_post = [
  body("text", "must be specifield").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { text } = req.body;
    var username = "";
    if (req.user) {
      username = req.user.username;
    } else {
      username = "unknown";
    }
    const comments = new Comments({
      username,
      text,
      commentID: req.params.post,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      // Successful, so render.
      res
        .json({
          errors: errors.array(),
          text: comments.text,
        })
        .status(400);
      return;
    }
    comments.save((err) => {
      if (err) {
        next(err);
      }
      Comments.find({ commentID: req.params.post }).exec(function (
        err,
        comments
      ) {
        if (err) {
          next(err);
        }
        res
          .json({
            comments,
          })
          .status(200);
      });
    });
  },
];
