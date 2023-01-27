const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      // required: "Email address is required",
      // validate: [validateEmail, "Please fill a valid email address"],
      // match: [
      //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //   "Please fill a valid email address",
      // ],
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
    // imageUrl: { type: String, required: true },
    // publicId: { type: String },
  },
  { timestamps: true }
);

UsersSchema.virtual("id").get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model("Users", UsersSchema);
