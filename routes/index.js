var express = require("express");
var router = express.Router();
var passport = require('passport')
const indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/", indexController.index);

router.get(
  "/all",
  indexController.all
);
module.exports = router;
 