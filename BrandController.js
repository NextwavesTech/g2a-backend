import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Brands } from "../model/Brand.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// create brand
export const createBrand = catchAsyncError(async (req, res, next) => {
  let image = req.files.image;
  const data = req.body;
  const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
  const slider = result.url;
  let data1 = {
    image: slider,
    name: data?.name,
  };
  //   console.log(data1);
  const newBrands = await Brands.create(data1);
  res.status(200).json({
    status: "success",
    message: "Main category created successfully!",
    data: newBrands,
  });
});

// get brand by id
export const getBrandById = async (req, res, next) => {
  const id = req?.params.id;
  try {
    const data = await Brands.findById(id);

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
// update brand
export const updateBrand = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const blogId = req.params.id;

  const updatedbrand = await Brands.findByIdAndUpdate(blogId, data, {
    new: true,
  });
  if (!updatedbrand) {
    return res.status(404).json({ message: "brand not found" });
  }

  res.status(200).json({
    status: "success",
    data: updatedbrand,
    message: "brand updated successfully!",
  });
});

// Get All brand
export const getAllBrand = catchAsyncError(async (req, res, next) => {
  try {
    const brands = await Brands.find();

    res.status(200).json({
      status: "success",
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});

// delete brand
export const deleteBrandById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delBrands = await Brands.findByIdAndDelete(id);
    if (!delBrands) {
      return res.json({ status: "fail", message: "Brand not Found" });
    }
    res.json({
      status: "success",
      message: "Brand deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
