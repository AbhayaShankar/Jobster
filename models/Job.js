const mongoose = require("mongoose");

const { Schema } = mongoose;

const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "please provide company name"],
      maxlength: 50,
    },

    position: {
      type: String,
      required: [true, "Enter your position of responsibility"],
      maxlength: 80,
    },

    status: {
      type: String,
      enum: ["interview", "pending", "declined"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide User"],
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },

    jobLocation: {
      type: String,
      default: "Remote",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jobs", JobSchema);
