import mongoose from "mongoose";
const Schema = mongoose.Schema;

const checkoutSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  totalPrice: {
    type: String,
    require: true,
  },
  delivery: { type: Object, require: true },
  productIds: [ // Updated field to handle multiple products
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  ],
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

export const Checkout = mongoose.model("Checkout", checkoutSchema);
