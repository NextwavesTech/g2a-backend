import mongoose from "mongoose";
const Schema = mongoose.Schema;

const platformSchema = new Schema({
  title: {
    type: String,
    require: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Platform = mongoose.model("Platform", platformSchema);
