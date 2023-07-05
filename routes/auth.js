const express = require("express");
const { register, login, updateUser } = require("../controllers/auth");
const router = express.Router();
const authenticatedUser = require("../middleware/authentication");
const testUser = require("../middleware/testUser");

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
