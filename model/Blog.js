import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  shortDescription: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Sellers",
  },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
});

export const Blogs = mongoose.model("Blogs", blogSchema);
