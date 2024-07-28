import express from "express";
const router = express.Router();

import {
  getBlog,
  getBlogById,
  createBlogs,
  updateBlog,
  deleteBlog,
  createBlogReview,
} from "../controllers/blogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getBlog).post(protect, admin, createBlogs);
router
  .route("/:id")
  .get(getBlogById)
  .put(protect, admin, updateBlog)
  .delete(protect, admin, deleteBlog);

router.route("/:id/reviews").post(protect, createBlogReview);

export default router;
