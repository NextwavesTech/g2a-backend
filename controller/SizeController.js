import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Blogs } from "../model/Blog.js";
import { SizeGuides } from "../model/SizeGuide.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// create Size Guide
export const createSizeGuide = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const newSizeGuides = await SizeGuides.create(data);
  res.status(200).json({
    status: "success",
    message: "Size Guide created successfully!",
    data: newSizeGuides,
  });
});

// get blog by id
export const getSizeById = async (req, res, next) => {
  const id = req?.params.id;
  try {
    const data = await SizeGuides.findById(id);

    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
};
// update Size Guide
export const updateSizeGuide = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const blogId = req.params.id;

  const updatedSizeGuides = await SizeGuides.findByIdAndUpdate(blogId, data, {
    new: true,
  });
  if (!updatedSizeGuides) {
    return res.status(404).json({ message: "Size Guide not found" });
  }

  res.status(200).json({
    status: "success",
    data: updatedSizeGuides,
    message: "Size Guide updated successfully!",
  });
});

// Get All Size Guide
export const getAllSize = catchAsyncError(async (req, res, next) => {
  try {
    const sizeGuides = await SizeGuides.find();
    res.status(200).json({
      status: "success",
      data: sizeGuides,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});
// delete Size Guide
export const deleteSizeGuidesById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delSizeGuides = await SizeGuides.findByIdAndDelete(id);
    if (!delSizeGuides) {
      return res.json({ status: "fail", message: "Size Guide not Found" });
    }
    res.json({
      status: "success",
      message: "Size Guide deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
