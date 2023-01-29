const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const postsSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  publish: { type: Boolean, required: true },
  date: { type: Date, require: true },
});

postsSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

// Virtual for postsScheme's URL
postsSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/post/${this._id}`;
});

module.exports = mongoose.model("Posts", postsSchema);
