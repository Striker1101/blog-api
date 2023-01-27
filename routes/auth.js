var express = require("express");
var router = express.Router();
// to unload data
// const multer = require("multer");
// const storage = multer.diskStorage({});
// const upload = multer({ storage: storage });

const authController = require("../controllers/authController");
/* GET users listing. */
//add photos
// upload.single("image"),
router.post("/", authController.sign_up_post);

router.get("/log-out", authController.logout_get);

router.post("/log-in", authController.login_post);

module.exports = router;
