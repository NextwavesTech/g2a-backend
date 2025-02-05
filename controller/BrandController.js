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
export const getAllBrand = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    // Aggregation pipeline for Brands, MidCategories, and SubCategories
    const brands = await Brands.aggregate([
      // Lookup midcategories for each brand
      {
        $lookup: {
          from: "midcategories", // Collection name
          localField: "_id", // Field in Brands
          foreignField: "brandId", // Field in MidCategory
          as: "midcategories",
        },
      },
      // Unwind midcategories array to process each midcategory individually
      { $unwind: { path: "$midcategories", preserveNullAndEmptyArrays: true } },
      // Lookup subcategories for each midcategory
      {
        $lookup: {
          from: "subcategories", // Collection name
          localField: "midcategories._id", // Field in MidCategory
          foreignField: "categoryId", // Field in SubCategory
          as: "midcategories.subcategories",
        },
      },
      // Re-group midcategories and subcategories back into an array
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          image: { $first: "$image" },
          createdAt: { $first: "$createdAt" },
          status: { $first: "$status" },
          midcategories: { $push: "$midcategories" },
        },
      },
      // Pagination: skip and limit
      { $skip: skip },
      { $limit: limit },
    ]);

    // Count total brands for pagination metadata
    const totalBrandsCount = await Brands.aggregate([
      {
        $lookup: {
          from: "midcategories",
          localField: "_id",
          foreignField: "brandId",
          as: "midcategories",
        },
      },
      { $unwind: { path: "$midcategories", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "midcategories._id",
          foreignField: "categoryId",
          as: "midcategories.subcategories",
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
      { $count: "total" },
    ]);

    const totalBrands = totalBrandsCount.length > 0 ? totalBrandsCount[0].total : 0;

    // Respond with the data
    res.status(200).json({
      status: "success",
      data: brands,
      pagination: {
        total: totalBrands,
        page,
        limit,
        totalPages: Math.ceil(totalBrands / limit),
      },
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

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
