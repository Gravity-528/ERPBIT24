import mongoose, { Schema } from "mongoose";
import { Placement } from "./placement.model.js";
import { Project } from "./project.model.js";
import { Award } from "./award.model.js";
import { Internship } from "./internship.model.js";
import { Exam } from "./exam.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [
        true,
        "Enter roll number in small case without special chars!",
      ],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password needs to be have atleast 6 chars!"],
    },
    fullName: {
      type: String,
      required: [true, "Full Name is required!"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll Number is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
    },
    idCard: {
      type: String,
      required: [true, "Id card is required for verification!"],
    },
    branch: {
      type: String,
      default: "",
    },
    section: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      minLength: [10, "Enter 10 digits of your mobile number!"],
      maxLength: [10, "Enter 10 digits of your mobile number!"],
      default: "0000000000",
    },
    semester: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    placementOne: {
      type: Schema.Types.ObjectId,
      ref: "Placement",
    },
    placementTwo: {
      type: Schema.Types.ObjectId,
      ref: "Placement",
    },
    placementThree: {
      type: Schema.Types.ObjectId,
      ref: "Placement",
    },
    proj: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    awards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Award",
      },
    ],
    higherEd: [
      {
        type: Schema.Types.ObjectId,
        ref: "HigherEducation",
      },
    ],
    internShips: [
      {
        type: Schema.Types.ObjectId,
        ref: "Internship",
      },
    ],
    exams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
    cgpa: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
