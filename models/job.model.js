const mongoose = require("mongoose");

const { jobStatuses } = require("../utils/constants");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: jobStatuses.active,
      enum: [jobStatuses.active, jobStatuses.expired],
    },
    applicants: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "User",
    },
    company: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Company",
    },
    postedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Job", jobSchema);
