const { body } = require("express-validator");

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("subCategory")
    .notEmpty()
    .withMessage("Subcategory ID is required")
    .isMongoId()
    .withMessage("Valid Subcategory ID is required"),

  body("variants")
    .notEmpty()
    .withMessage("Variants are required")
    .custom((value) => {
      let variants;
      try {
        variants = typeof value === "string" ? JSON.parse(value) : value;
      } catch (err) {
        throw new Error("Invalid variants format");
      }

      if (!Array.isArray(variants) || variants.length === 0) {
        throw new Error("A product must have at least one variant");
      }

      variants.forEach((variant, index) => {
        if (!variant.ram || String(variant.ram).trim() === "") {
          throw new Error(`Variant at index ${index} must have RAM`);
        }
        if (variant.price === undefined || variant.price === null || Number(variant.price) < 0) {
          throw new Error(`Variant at index ${index} must have a valid price`);
        }
        if (variant.qty === undefined || variant.qty === null || Number(variant.qty) < 0) {
          throw new Error(`Variant at index ${index} must have a valid quantity`);
        }
      });
      return true;
    }),
];

module.exports = {
  createProductValidation,
};
