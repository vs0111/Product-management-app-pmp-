const Product = require("../models/Product");
const User = require("../models/User");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, subCategory, description } = req.body;
    let variants = req.body.variants;

    // Convert variants string to array
    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }

    // Validate required fields
    if (!name || !subCategory || !variants || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Name, subCategory, and at least one variant are required",
      });
    }

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least 1 image is required",
      });
    }

    if (req.files.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum 3 images are allowed",
      });
    }

    // Store image paths
    const images = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    // Create product
    const product = await Product.create({
      name,
      subCategory,
      variants,
      description,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subCategory, description } = req.body;
    let variants = req.body.variants;

    // Convert variants string to array
    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }

    const updateData = {
      name,
      subCategory,
      variants,
      description,
    };

    // Keep existing images
    let finalImages = [];

    if (req.body.existingImages) {
      if (typeof req.body.existingImages === "string") {
        try {
          finalImages = JSON.parse(req.body.existingImages);
        } catch {
          finalImages = [req.body.existingImages];
        }
      } else if (Array.isArray(req.body.existingImages)) {
        finalImages = req.body.existingImages;
      }
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/${file.filename}`
      );

      finalImages = [...finalImages, ...newImages];
    }

    // Validate image count
    if (finalImages.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum 3 images are allowed",
      });
    }

    // At least one image required
    if (
      req.body.existingImages !== undefined &&
      finalImages.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least 1 image is required",
      });
    }

    if (finalImages.length > 0) {
      updateData.images = finalImages;
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Products
const getProducts = async (req, res) => {
  try {
    const {
      search,
      subCategory,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by product name
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by subcategory
    if (subCategory) {
      query.subCategory = subCategory;
    }

    const products = await Product.find(query)
      .populate("subCategory", "name")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Product Details
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Add Product to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);

    // Check product already exists in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Remove Product from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await User.findById(userId);

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Wishlist Products
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Search Products (Dedicated Endpoint)
const searchProducts = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;

    if (!keyword) {
      return res.status(200).json({
        success: true,
        products: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
      });
    }

    const query = { name: { $regex: keyword, $options: "i" } };

    const products = await Product.find(query)
      .populate("subCategory", "name")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  searchProducts,
};