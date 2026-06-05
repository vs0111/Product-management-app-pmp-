const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Wishlist routes (must be before /:id)
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:id", protect, addToWishlist);
router.delete("/wishlist/:id", protect, removeFromWishlist);

// Product routes
router.post("/", protect, upload.array("images", 10), createProduct);
router.put("/:id", protect, upload.array("images", 10), updateProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
