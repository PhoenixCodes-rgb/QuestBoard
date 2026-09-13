const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists with this email" });
  }

  // Salt & Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  email = email.trim().toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// GET CURRENT USER PROFILE
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// UPDATE USER PROFILE
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, currentPassword, newPassword } = req.body;

  if (name && name.trim()) {
    user.name = name.trim();
  }

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required to set a new password" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    token: generateToken(updatedUser._id),
  });
});

module.exports = { registerUser, loginUser, getMe, updateProfile };