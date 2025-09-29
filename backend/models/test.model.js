const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const testSchema = new Schema(
  {
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
