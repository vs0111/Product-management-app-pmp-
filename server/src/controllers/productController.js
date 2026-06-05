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
        message: "Name, subCategory, and at least one variant are required.",
      });
    }

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least 1 image is required.",
      });
    }

    if (req.files.length > 3) {
      return res.status(400).json({
        message: "A maximum of 3 images is allowed.",
      });
    }

    // Store image paths
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    // Create product
    const product = new Product({
      name,
      subCategory,
      variants,
      description,
      images,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
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

    // Update images if uploaded
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({
          message: "A maximum of 3 images is allowed.",
        });
      }

      updateData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Products
const getProducts = async (req, res) => {
  try {
    const { search, subCategory, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search by name
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
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Product to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Product from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await User.findById(userId);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Wishlist Products
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("wishlist");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
};
