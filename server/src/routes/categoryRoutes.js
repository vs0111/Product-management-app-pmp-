const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  createSubCategory,
  getSubCategories,
} = require("../controllers/categoryController");
const {
  createCategoryValidation,
  createSubCategoryValidation,
} = require("../validations/categoryValidation");
const validate = require("../middleware/validationMiddleware");
const protect= require("../middleware/authMiddleware");


// Category Routes
router.post("/", protect, createCategoryValidation, validate, createCategory);
router.get("/", protect, getCategories);

// SubCategory Routes
router.post("/subcategories",protect,createSubCategoryValidation,validate,createSubCategory,);
router.get("/subcategories", protect, getSubCategories);

module.exports = router;
