var express = require("express");
var router = express.Router();
const passport = require("passport");
const postController = require("../controllers/postController");

/* GET home page. */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.posts_post
);

router.get("/:postId", postController.posts_get);

router.post("/:post/comments", postController.comments_post);

router.get("/:post/comments", postController.comments_get);

router.get(
  "/:postId/comments/:commentID",
  passport.authenticate("jwt", { session: false }),
  postController.comment_one_get
);

module.exports = router;
// passport.authenticate('jwt', {session: false}), user
