import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  rating: {
    type: Number,
    require: true,
  },
  review: {
    type: String,
    require: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Products",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  platform: {
    type: String,
    require: true,
  },
  recommend: {
    type: Boolean,
    require: true,
  },
});

export const Rating = mongoose.model("Rating", ratingSchema);
