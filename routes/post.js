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

router.put(
  "/:post/update_image",
  passport.authenticate("jwt", { session: false }),
  postController.posts_update_image 
);

router.put(
  "/:post/update",
  passport.authenticate("jwt", { session: false }),
  postController.posts_update
);

router.post(
  "/:post/toggle",
  passport.authenticate("jwt", { session: false }),
  postController.toggle
);

router.delete(
  "/:post/delete",
  passport.authenticate("jwt", { session: false }),
  postController.delete_post
);

router.delete(
  "/:post/comments/:commentID/delete",
  passport.authenticate("jwt", { session: false }),
  postController.delete_comment
);

router.get("/:postId", postController.posts_get);

router.post(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.posts_update
);

router.post(
  "/:post/comments",
  passport.authenticate("jwt", { session: false }),
  postController.comments_post
);

router.get("/:post/comments", postController.comments_get);

router.get("/:post/comments/:commentID", postController.comment_one_get);

router.put(
  "/:post/comments/:commentID/update",
  passport.authenticate("jwt", { session: false }),
  postController.comment_one_update
);

module.exports = router;
// passport.authenticate('jwt', {session: false}), user
