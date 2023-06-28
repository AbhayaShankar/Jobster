const express = require("express");
const { register, login, updateUser } = require("../controllers/auth");
const router = express.Router();
const authenticatedUser = require("../middleware/authentication");

router.post("/register", register);
router.post("/login", login);
router.patch("/updateUser", authenticatedUser, updateUser);

module.exports = router;
