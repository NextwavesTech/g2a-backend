import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brands",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MidCategory",
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sellers",
  },
  title: {
    type: String,
    require: true,
  },
  images: {
    type: Array,
    require: true,
  },
  actualPrice: {
    type: String,
    require: true,
  },

  discountPrice: {
    type: String,
    require: true,
  },
  gst: {
    type: String,
    require: true,
  },
  stock: {
    type: String,
    require: true,
  },
  minStock: {
    type: String,
    require: false,
  },
  description: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "platform",
  },
  type: {
    type: String,
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "region",
  },
  stockStatus: {
    type: String,
    enum: ["In Stock", "Out Of Stock"],
  },
});

export const Products = mongoose.model("Products", productSchema);
