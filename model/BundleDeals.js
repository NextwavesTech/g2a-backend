import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bundleDealsSchema = new Schema({
  title: {
    type: String,
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

  endDate: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products", // Reference the "Products" collection
    },
  ],
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
});

export const BundleDeals = mongoose.model("BundleDeals", bundleDealsSchema);
