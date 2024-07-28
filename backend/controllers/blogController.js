import asyncHandler from "express-async-handler";

import Blog from "../models/blogModel.js";

//@desc Fetch all Genres
//@route GET /api/products
//@access public
const getBlog = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Blog.countDocuments({ ...keyword });
  const blogs = await Blog.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch a Genre
//@route GET /api/products/:id
//@access public
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    return res.json(blog);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

//@desc Create a Genres
//@route POST /api/products
//@access Private/Admin
const createBlogs = asyncHandler(async (req, res) => {
  const blog = new Blog({
    name: "Sample name",
    user: req.user._id,
    image: "/images/attacks.jpg",
    category: "Other",
    description: "Sample description",
  });

  // console.log(product.price);

  const createdBlog = await blog.save();

  res.status(201).json(createdBlog);
});

//@desc update a genre
//@route PUT /api/products/:id
//@access private/admin
const updateBlog = asyncHandler(async (req, res) => {
  const { name, description, image, category } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.name = name;
    blog.description = description;
    blog.image = image;
    blog.category = category;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error("Resource not found ");
  }
});

//@desc delete a genre
//@route DELETE /api/products/:id
//@access private/admin
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    await blog.deleteOne({ _id: blog._id });
    res.status(200).json({ message: "Blog delete" });
  } else {
    res.status(404);
    throw new Error("Resource not found ");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createBlogReview = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    const alreadyReviewed = blog.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Blog already reviewed");
    }

    const review = {
      name: req.user.name,
      comment,
      user: req.user._id,
    };

    blog.reviews.push(review);

    await blog.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("blog not found");
  }
});

export {
  getBlog,
  getBlogById,
  createBlogs,
  updateBlog,
  deleteBlog,
  createBlogReview,
};
