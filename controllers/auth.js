const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  console.log(user);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please fill email and password fields...");
  }

  const user = await User.findOne({ email });
  console.log(user);

  // Check if user credentials exists (credentials are valid.)
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // compare passwords
  const validPassword = await user.checkPassword(password);

  if (!validPassword) {
    throw new UnauthenticatedError(
      "Invalid Password, check your password and try again"
    );
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });

  res.send("Congoo");
};

module.exports = { register, login };
