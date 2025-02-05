import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  companyName: {
    type: String,
    require: true,
  },
  logo:{
    type: String,
  },
  registrationNumber: {
    type: String,
    require: true,
  },
  taxNumber: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  companyName: {
    type: String,
    require: true,
  },
  companyAdress: {
    type: Object,
    require: true,
  },
  registredAddress: {
    type: Object,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  cnicFront: {
    type: String,
    require: true,
  },
  cnicBack: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  description: {
    type: String,
    require: true,
  },
});

export const Sellers = mongoose.model("Sellers", sellerSchema);
