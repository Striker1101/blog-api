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

exports.posts_update_image = (req, res, next) => {
  const { imageUrl, publicId } = req.body;
  const posts = {
    imageUrl,
    publicId,
  };
 
  Post.findByIdAndUpdate(req.params.post, posts, (err) => {
    if (err) {
      next(err);
    }
    res.status(200)
  });
};


exports.posts_update = (req, res, next) => {
  const { title,
    summary,
    publish,
    content,
      } = req.body;
  const posts = {
    title,
    summary,
    publish,
    content,
  };
  console.log('here')
  Post.findByIdAndUpdate(req.params.post, posts, (err) => {
    if (err) {
      next(err);
    }
    Post.find({})
     .exec((err, posts)=>{
      if (err){
        next(err)
      }
      res.json({posts}).status(200)
     })
  });
};

exports.posts_update = [
  body("title", "title must be included").isLength({ min: 1 }).trim().escape(),
  body("summary", " must contain a descriptive message of more than 15 words")
    .isLength({ min: 10 })
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const { title, summary, content, publish, date } = req.body;

    const post = new Post({
      title,
      summary,
      content,
      publish,
      date,
      _id: req.params.postId,
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

    Post.findByIdAndUpdate(req.params.postId, post, {}, (err, result) => {
      if (err) {
        next(err);
      }
      res.json({ message: "ok" }).status(200);
    });
  },
];

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

exports.comment_one_update = (req, res, next) => {
  const { text } = req.body;
  const comment = {
    text,
  };
  Comments.findByIdAndUpdate(req.params.commentID, comment, (err) => {
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
      res.json({
        comments,
      });
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

exports.toggle = (req, res, next) => {
  Post.find({ _id: req.params.post }).exec(function (err, post) {
    if (err) {
      next(err);
    }

    const newPost = new Post({
      _id: req.params.post,
      title: post.title,
      summary: post.summary,
      content: post.content,
      publish: req.body.toggle,
      date: post.date,
    });
    Post.findByIdAndUpdate(req.params.post, newPost, {}, (err, post) => {
      if (err) {
        next(err);
      }

      Post.find({}).exec(function (err, posts) {
        if (err) {
          next(err);
        }
        res
          .json({
            posts,
          })
          .status(200);
      });
    });
  });
};

exports.delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.params.post, (err) => {
    if (err) {
      next(err);
    }

    Post.find({}).exec(function (err, posts) {
      if (err) {
        next(err);
      }
      res
        .json({
          posts,
        })
        .status(200);
    });
  });
};

exports.delete_comment = (req, res, next) => {
  Comments.findByIdAndRemove(req.params.commentID, (err) => {
    if (err) {
      next(err);
    }
    console.log();
    Comments.find({ commentID: req.params.post }).exec(function (
      err,
      comments
    ) {
      if (err) {
        next(err);
      }
      res.json({
        comments,
      });
    });
  });
};

exports.posts_post = [
  body("title", "title must be present").isLength({ min: 1 }).trim().escape(),
  body("summary", " please add words of more than 15 words")
    .isLength({ min: 10 })
    .trim()
    .escape(),
  async function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const { title, summary, content, publish, date } = req.body;

    const post = new Post({
      title,
      summary,
      content,
      publish,
      imageUrl: "",
      publicId: "",
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
    post.save((err, post) => {
      if (err) {
        return next(err);
      }
      res.json({ id: post._id }).status(200);
    });
  },
];

exports.comments_post = [
  body("text", "must be specifield").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { text } = req.body;
    const comments = new Comments({
      username: req.user.username,
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
