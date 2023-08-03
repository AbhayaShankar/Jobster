const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// Register User
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

// Login user
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

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });

  res.send("Congoo");
};

// Updating User
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  console.log(req.user);

  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide values in fields");
  }

  const user = await User.findOne({ _id: req.user.userId });

  // Also Can be done like this

  // const user = await User.findByIdAndUpdate(
  //   { _id: req.user.userId },
  //   req.body,
  //   { new: true, runValidators: true }
  // );

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });

  console.log(req.user);
  console.log(req.body);
};

module.exports = { register, login, updateUser };
