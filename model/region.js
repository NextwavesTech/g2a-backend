import mongoose from "mongoose";
const Schema = mongoose.Schema;

const regionSchema = new Schema({
  title: {
    type: String,
    require: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Region = mongoose.model("Region", regionSchema);
