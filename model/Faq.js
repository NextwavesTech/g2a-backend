import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const FaqSchema = new Schema({
  question: {
    type: String,
    require: true,
  },
  answer: {
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
});

export const FAQ = mongoose.model("FAQs", FaqSchema);
