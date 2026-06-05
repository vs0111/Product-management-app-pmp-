const { body } = require("express-validator");

const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required"),
];

const createSubCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subcategory name is required"),
  
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Valid Category ID is required"),
];

module.exports = {
  createCategoryValidation,
  createSubCategoryValidation,
};
