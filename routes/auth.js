const express = require("express");

// all the logics for routes is defined or setup in controllers for maintaining clean code structure
const { register, login, updateUser } = require("../controllers/auth");

// Router is used for not specifying the entire route URL everytime.
const router = express.Router();

const authenticatedUser = require("../middleware/authentication");

// Test user for quick access for overall view without login or signup.
const testUser = require("../middleware/testUser");

// Another package for limiting hitting API endpoints.
const rateLimiter = require("express-rate-limit");
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    msg: "Too many requests from this IP, please try again after 15 minutes",
  },
});

router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);
router.patch("/updateUser", authenticatedUser, testUser, updateUser);

module.exports = router;
