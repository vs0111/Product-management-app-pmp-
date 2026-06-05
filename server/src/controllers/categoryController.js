const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check existing category
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Save category
    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create Subcategory
const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    // Check parent category
    const categoryExists = await Category.findById(categoryId);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Parent category not found",
      });
    }

    // Check existing subcategory
    const subCategoryExists = await SubCategory.findOne({
      name,
      category: categoryId,
    });

    if (subCategoryExists) {
      return res.status(400).json({
        message: "Subcategory already exists in this category",
      });
    }

    // Save subcategory
    const subCategory = await SubCategory.create({
      name,
      category: categoryId,
    });

    res.status(201).json({
      success: true,
      data: subCategory,
      message: "Subcategory created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Subcategories
const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const query = categoryId ? { category: categoryId } : {};

    const subCategories = await SubCategory.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  createSubCategory,
  getSubCategories,
};