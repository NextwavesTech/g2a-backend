import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const subscribeSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
});

export const Subscribe = mongoose.model("Subscribe", subscribeSchema);
