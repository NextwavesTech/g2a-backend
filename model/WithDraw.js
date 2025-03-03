import mongoose from "mongoose";
const Schema = mongoose.Schema;

const withDrawSchema = new Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sellers",
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
  amount: {
    type: String,
    required: true,
  },
});

export const WithDraw = mongoose.model("withDraw", withDrawSchema);
