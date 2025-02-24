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
  key: {
    type: String,
    default: null,
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
    default: 0,
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
    ref: "Platform",
  },
  type: {
    type: String,
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
  },
  stockStatus: {
    type: String,
    enum: ["In Stock", "Out Of Stock"],
  },
  likes: {
    type: Array,
  },
});

productSchema.pre("save", function (next) {
  if (this.stock <= this.minStock) {
    this.stockStatus = "Out Of Stock";
  } else {
    this.stockStatus = "In Stock";
  }
  next();
});

export const Products = mongoose.model("Products", productSchema);
