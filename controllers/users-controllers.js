const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Pesan = require("../models/pesan");
const Stok = require("../models/stok");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const { fullName, role, email, password, photo } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    fullName,
    role,
    email,
    password: hashedPassword,
    photo: photo,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    fullName: createdUser.fullName,
    role: createdUser.role,
    email: createdUser.email,
    photo: createdUser.photo,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    fullName: existingUser.fullName,
    role: existingUser.role,
    email: existingUser.email,
    photo: existingUser.photo,
    token: token,
  });
};

const updateProfile = async (req, res, next) => {
  const { fullName, password, photo } = req.body;

  let userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "could not create user, please try again.",
      500
    );
    return next(error);
  }

  if (password) {
    user.password = hashedPassword;
  }
  if (!password) {
    user.password = user.password;
  }

  let pesan;
  let stok;
  if (user.role === "Pembeli") {
    pesan = await Pesan.find({ idPembeli: user.id });
    if (pesan) {
      pesan.map((item) => {
        item.namaPangkalan = fullName;
        item.photoPangkalan = photo;
        item.save();
      });
    }
  }
  if (user.role === "pangkalan") {
    pesan = await Pesan.find({ idPangkalan: user.id });
    stok = await Stok.find({ idPangkalan: user.id });
    if (pesan) {
      pesan.map((item) => {
        item.namaPangkalan = fullName;
        item.photoPangkalan = photo;
        item.save();
      });
    }
    if (stok) {
      stok.map((item) => {
        item.namaPangkalan = fullName;
        item.photo = photo;
        item.save();
      });
    }
  }

  user.fullName = fullName;
  user.photo = photo;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.json({
    userId: user.id,
    fullName: user.fullName,
    role: user.role,
    email: user.email,
    photo: user.photo,
    token: user,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateProfile = updateProfile;
