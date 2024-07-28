import jwt from "jsonwebtoken";
// import asyncHandle from "./asyncHandler.js";
import asyncHandle from "express-async-handler";

import User from "../models/userModel.js";

const protect = asyncHandle(async (req, res, next) => {
  let token;

  //Read the jwt from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized,no token");
  }
});

//Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as Admin");
  }
};

//seller middleware
const seller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as Seller");
  }
};

// Middleware for both admin and seller
const adminSeller = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.isSeller)) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as Admin or Seller");
  }
};

export { protect, admin, seller, adminSeller };
