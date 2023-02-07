const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// const { uploadToCloudinary, removeFromCloudinary } = require("./cloudinary");
//jwt stuff
const jwt = require("jsonwebtoken");

exports.login_post =
  ("/login",
  function (req, res, next) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res
          .json({
            user: user,
            info,
          }) 
          .status(400);
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.json({ err }).status(400);
        }

        // generate a signed son web token with the contents of user object and return it in the response
        const opts = {};
        opts.expiresIn = 120;
        //add opts to token to add a experiation time
        const token = jwt.sign({ user }, "your_jwt_secret");
        // console.log(req.user);
        return res.json({ user, token });
      });
    })(req, res);
  });

exports.sign_up_post = [
  body("username", "username must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password must be more than 4 words")
    .isLength({ min: 4 })
    .escape(),

  async function (req, res, next) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    // otherwise, store hashedPassword in DB
    // const data = await uploadToCloudinary(req.file.path, "club_house");
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      role: "subscriber",
      // imageUrl: data.url,
      // publicId: data.public_id,
    });
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .json({
          user: user,
          errors: errors.array(),
        })
        .status(400);
      return;
    }
    //sucess
    user.save((err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: true }).status(200);
    });
  },
];
