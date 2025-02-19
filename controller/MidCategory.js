import { catchAsyncError } from "../middleware/catchAsyncError.js";
// import { Category } from "../model/category.js";
import { MidCategory } from "../model/MidCategory.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// create category
export const createCategory = catchAsyncError(async (req, res, next) => {
  let image = req.files.image;
  const data = req.body;
  const title = data?.title;
  const findName = await MidCategory.findOne({ title: title });
  if (findName) {
    return res.status(400).json({
      status: "fail",
      message: "This name already exists!",
    });
  }
  const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
  const slider = result.url;
  let data1 = {
    image: slider,
    title: title,
    brandId:data?.brandId
  };

  // console.log(data1);
  // const data = req.body;

  const newCategory = await MidCategory.create(data1);
  res.status(200).json({
    status: "success",
    message: "New Category created successfully!",
    data: newCategory,
  });
});

// get category by id
export const getCategoryById = async (req, res, next) => {
  const id = req?.params.id;
  try {
    const data = await MidCategory.findById(id);

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
// update category
export const updateCategory = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const categoryId = req.params.id;

  const updatedCategory = await MidCategory.findByIdAndUpdate(categoryId, data, {
    new: true,
  });
  if (!updatedCategory) {
    return res.status(404).json({ message: "blog not found" });
  }

  res.status(200).json({
    status: "success",
    data: updatedCategory,
    message: "Category updated successfully!",
  });
});

// Get All category
export const getAllCategory = catchAsyncError(async (req, res, next) => {
  try {
    const categories = await MidCategory.aggregate([
      {
        $lookup: {
          from: 'subcategories',        
          localField: '_id',       
          foreignField: 'categoryId',     
          as: 'subcategories',     
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});

export const getallcategoryByBrandId = catchAsyncError (async (req,res,next)=>{
  const brandId = req.params.brandId;
  try {
      const categories = await MidCategory.find({brandId:brandId})
  
      res.status(200).json({
        status: "success",
        data: categories,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        status: "fail",
        error: "Internal Server Error",
      });
    }
})
export const getallcategoryforAdmin = catchAsyncError (async (req,res,next)=>{
    try {
        const categories = await MidCategory.find().populate('brandId')
    
        res.status(200).json({
          status: "success",
          data: categories,
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
          status: "fail",
          error: "Internal Server Error",
        });
      }
})
// delete category
export const deleteCategoryById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delCategory = await MidCategory.findByIdAndDelete(id);
    if (!delCategory) {
      return res.json({ status: "fail", message: "Category not Found" });
    }
    res.json({
      status: "success",
      message: "Category deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
