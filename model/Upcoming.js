import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const upcomingSchema = new Schema({
  banner: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },

  addedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Upcoming = mongoose.model("Upcoming", upcomingSchema);
