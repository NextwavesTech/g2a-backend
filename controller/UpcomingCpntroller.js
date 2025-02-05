import { Upcoming } from "../model/Upcoming.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});
export const createUpcoming = async (req, res) => {
  let image = req.files.banner;
  let image1 = req.files.logo;
  const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
  const slider = result.url;
  const result1 = await cloudinary.v2.uploader.upload(image1.tempFilePath);

  const data = req.body;
  const obj = {
    banner: slider,
    logo: result1.url,
    productId: data.productId,
  };
  const newUpcoming = await Upcoming.create(obj);
  res.status(200).json({
    status: "success",
    message: "New Upcoming created successfully!",
    data: newUpcoming,
  });
};
export const getAllUpcoming = async (req, res) => {
  const allUpcoming = await Upcoming.find().populate("productId");
  res.status(200).json({
    status: "success",
    message: "All Upcoming fetched successfully!",
    data: allUpcoming,
  });
};
export const updateUpcoming = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const upcoming = await Upcoming.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    message: "Upcoming updated successfully!",
    data: upcoming,
  });
};
export const getUpcoming = async (req, res) => {
  const { id } = req.params;
  const upcoming = await Upcoming.findById(id);
  res.status(200).json({
    status: "success",
    message: "Upcoming fetched successfully!",
    data: upcoming,
  });
};

export const deleteUpcoming = async (req, res) => {
  const { id } = req.params;
  const deleteUpcoming = await Upcoming.findByIdAndDelete(id);
  if (!deleteUpcoming) {
    return res.status(404).json({
      status: "fail",
      message: "Upcoming not found!",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Upcoming deleted successfully!",
  });
};
