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

// pre save middleware on the UserSchema. It means that before saving a new user or updating an existing user in the database, this middleware function will be executed.

/*
if (!this.isModified("password")) return;: Inside the middleware function, it first checks if the password field of the user document has been modified. If it hasn't been modified, it means the user document is being saved or updated without changing the password. In this case, the function returns early without doing anything to the password field.

const salt = await bcrypt.genSalt(10);: If the password field has been modified, the function proceeds to generate a salt using the bcrypt.genSalt() method. A salt is a random value that adds additional security when hashing passwords. The genSalt() method generates a salt with a cost factor of 10, which determines how computationally intensive the hashing process should be.

this.password = await bcrypt.hash(this.password, salt);: After generating the salt, the function uses bcrypt.hash() to hash the user's password. The password value is replaced with its hash, making it more secure than storing the plain text password in the database.
*/

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
