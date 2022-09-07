//User schema-> User{name,userId,email,password,userType,userStatus,}

const mongoose = require("mongoose");
const { userTypes, userStatuses } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minLength: 5,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    userType: {
      type: String,
      default: userTypes.applicant,
      enum: [userTypes.admin, userTypes.applicant, userTypes.hr],
    },
    userStatus: {
      type: String,
      default: userStatuses.approved,
      enum: [
        userStatuses.approved,
        userStatuses.rejected,
        userStatuses.pending,
      ],
    },
    jobsApplied: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Job",
    },
    companyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
