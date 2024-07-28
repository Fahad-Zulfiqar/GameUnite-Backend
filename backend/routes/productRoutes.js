import express from "express";
const router = express.Router();
//1
// import products from "../data/products.js";
//2
// import asyncHandle from "../middleware/asyncHandler.js";
// import Genre from "../modals/genreModal.js";
//3
import {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
  createGenreReview,
  getTopGenre,
  getGenresByUser,
  getUserProducts,
} from "../controllers/genreController.js";
import {
  protect,
  admin,
  seller,
  adminSeller,
} from "../middleware/authMiddleware.js";

// router.get(
//   "/",
//   asyncHandle(async (req, res) => {
//     const products = await Genre.find({});
//     res.json(products);
//   })
// );

// router.get(
//   "/:id",
//   asyncHandle(async (req, res) => {
//     // const product = products.find((p) => p._id === req.params.id);
//     const product = await Genre.findById(req.params.id);
//     if (product) {
//       return res.json(product);
//     } else {
//       res.status(404);
//       throw new Error("Genre not found");
//     }
//   })
// );

//3
router.route("/").get(getGenres).post(protect, adminSeller, createGenre);
router.get("/top", getTopGenre);
router
  .route("/:id")
  .get(getGenreById)
  .put(protect, adminSeller, updateGenre)
  .delete(protect, adminSeller, deleteGenre);

router.route("/:id/reviews").post(protect, createGenreReview);

router.route("/user/:userId").get(getGenresByUser);
router.get("/user/:userId", getUserProducts);

export default router;
