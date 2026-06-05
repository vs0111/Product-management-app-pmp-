const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  ram: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  qty: {
    type: Number,
    required: true,
    min: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    variants: {
      type: [variantSchema],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "A product must have at least one variant.",
      },
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
