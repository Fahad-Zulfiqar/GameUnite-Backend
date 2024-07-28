import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import blogs from "./data/blogs.js";
import User from "./models/userModel.js";
import Genre from "./models/genreModel.js";
import Order from "./models/orderModel.js";
import Blog from "./models/blogModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Blog.deleteMany();
    await Order.deleteMany();
    await Genre.deleteMany();
    await User.deleteMany();

    const createUsers = await User.insertMany(users);

    const adminUser = createUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    const sampleBlogs = blogs.map((blog) => {
      return { ...blog, user: adminUser };
    });

    await Genre.insertMany(sampleProducts);
    await Blog.insertMany(sampleBlogs);

    console.log("Data imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Blog.deleteMany();
    await Order.deleteMany();
    await Genre.deleteMany();
    await User.deleteMany();

    console.log("Data destroy!".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

// console.log(process.argv[2])
