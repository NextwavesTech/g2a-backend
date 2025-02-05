import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sizeSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  sizes:{
    type:Array,
    require:true
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

export const SizeGuides = mongoose.model("SizeGuides", sizeSchema);
