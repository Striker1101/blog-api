const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true },
    commentID: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  },
  { timestamps: true, timeseries: true }
);

module.exports = mongoose.model("Comments", commentsSchema);
