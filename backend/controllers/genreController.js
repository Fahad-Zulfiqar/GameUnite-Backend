import asyncHandler from "express-async-handler";

import Genre from "../models/genreModel.js";

//@desc Fetch all Genres
//@route GET /api/products
//@access public
const getGenres = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Genre.countDocuments({ ...keyword });
  const products = await Genre.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "name");
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch a Genre
//@route GET /api/products/:id
//@access public
const getGenreById = asyncHandler(async (req, res) => {
  const product = await Genre.findById(req.params.id).populate("user", "name");
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Genre not found");
  }
});

//@desc Create a Genres
//@route POST /api/products
//@access Private/Admin
const createGenre = asyncHandler(async (req, res) => {
  const product = new Genre({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/attacks.jpg",
    platform: ["PC"],
    category: ["Other"],
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  // console.log(product.price);

  const createdGenre = await product.save();

  res.status(201).json(createdGenre);
});

//@desc update a genre
//@route PUT /api/products/:id
//@access private/admin
const updateGenre = asyncHandler(async (req, res) => {
  const { name, price, description, image, platform, category, countInStock } =
    req.body;

  const product = await Genre.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.platform = platform;
    product.category = category;
    product.countInStock = countInStock;

    const updatedGenre = await product.save();
    res.json(updatedGenre);
  } else {
    res.status(404);
    throw new Error("Resource not found ");
  }
});

//@desc delete a genre
//@route DELETE /api/products/:id
//@access private/admin
const deleteGenre = asyncHandler(async (req, res) => {
  const product = await Genre.findById(req.params.id);

  if (product) {
    await product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product delete" });
  } else {
    res.status(404);
    throw new Error("Resource not found ");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createGenreReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Genre.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc get Top rated Genre
//@route GET /api/products/:id
//@access public
const getTopGenre = asyncHandler(async (req, res) => {
  const products = await Genre.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

//@desc Fetch genres by user ID
//@route GET /api/products/user/:userId
//@access private
const getGenresByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const genres = await Genre.find({ user: userId }).populate("user", "name");

  if (genres) {
    res.json(genres);
  } else {
    res.status(404);
    throw new Error("Genres not found");
  }
});

const getUserProducts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const genres = await Genre.find({ user: userId });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
  createGenreReview,
  getTopGenre,
  getGenresByUser,
  getUserProducts,
};
