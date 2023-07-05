const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // check headers

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Failed");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === "649c8817e4b0daf8b2511831";
    // attach the user to the job routes...
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Failed For Current User");
  }
};

module.exports = auth;
