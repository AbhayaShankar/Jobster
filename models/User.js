const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var validateEmail = function (email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    min: [3, "Enter your full name"],
    max: [60, "Name character too long... Dont write your entire family name."],
  },

  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "lastname",
  },

  email: {
    type: String,
    required: [true, "Email field is required"],
    lowercase: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill a valid email...",
    ],
  },

  location: {
    type: String,
    trim: true,
    maxlength: 60,
    default: "my city",
  },

  password: {
    type: String,
    required: [true, "Please enter a strong password"],
    minlength: 6,
  },
});

// this.isModifiedPaths()

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFESPAN,
    }
  );
};

UserSchema.methods.checkPassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
