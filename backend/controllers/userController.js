// import asyncHandle from "../middleware/asyncHandler.js";
import asyncHandle from "express-async-handler";

import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

//@desc Auth user & token
//@route POST /api/users/login
//@access public
const authUser = asyncHandle(async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // res.send("auth user");
});

//@desc Register user
//@route POST /api/users
//@access public
const registerUser = asyncHandle(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // res.send("register user");
});

//@desc logout user / clear cookie
//@route POST /api/users/logout
//@access private
const logoutUser = asyncHandle(async (req, res) => {
  res.cookie("jwt", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged Out Successfully" });

  // res.send("logout user");
});

//@desc Get user profile
//@route Get /api/users/profile
//@access private
const getUserProfile = asyncHandle(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }

  // res.send("get user profile");
});

//@desc update user profile
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandle(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }

  // res.send("update user profile");
});

//@desc Get users
//@route Get /api/users
//@access private/Admin
const getUsers = asyncHandle(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);

  // res.send("get users");
});

//@desc Get user by ID
//@route Get /api/users/:id
//@access private/Admin
const getUserById = asyncHandle(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json("User not found");
  }

  // res.send("get users by id");
});

//@desc delete user profile
//@route DELETE /api/users/:id
//@access private/Admin
const deleteUser = asyncHandle(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(400);
    throw new Error("User not found");
  }

  // res.send("delete user");
});

//@desc update user
//@route PUT /api/users/:id
//@access private/Admin
const updateUser = asyncHandle(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isSeller = req.body.isSeller || user.isSeller; // Update isSeller property

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

  // res.send("update user");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
