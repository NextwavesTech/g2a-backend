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
  platform :{
    type: String,
  },
  type:{
    type: String,
  },
  region:{
    type: String,
  }
});

export const Products = mongoose.model("Products", productSchema);





