import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { SubCategory } from "../model/SubCategory.js";
import { Products } from "../model/Product.js";

import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: "ddu4sybue",
    api_key: "658491673268817",
    api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});


// create SubCategory
export const createSubCategory = catchAsyncError(async (req, res, next) => {
    const data = req.body;

    const newSubCategory = await SubCategory.create(data);
    res.status(200).json({
        status: "success",
        message: "New SubCategory created successfully!",
        data: newSubCategory,
    });

});


// get SubCategory by id
export const getSubCategoryById = async (req, res, next) => {
    const id = req?.params.id;
    try {
        const data = await SubCategory.findById(id);

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
// update SubCategory
export const updateSubCategory = catchAsyncError(async (req, res, next) => {
    const data = req.body;
    const categoryId = req.params.id;
  
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(categoryId, data, {
      new: true,
    });
    if (!updatedSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    
  
  
    res.status(200).json({
      status: 'success',
      data: updatedSubCategory,
      message: "SubCategory updated successfully!",
    });
  });


// Get All SubCategory
export const getAllSubCategory = catchAsyncError(async (req, res, next) => {
    try {
        const subcategory = await SubCategory.find().populate('categoryId').populate('brandId');
        res.status(200).json({
            status: "success",
            data: subcategory,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: "fail",
            error: "Internal Server Error",
        });
    }
});
export const getCategoryById = catchAsyncError(async (req, res, next) => {
    const categoryId = req?.params.id;
    try {
        const subcategory = await SubCategory.find({categoryId:categoryId})
        res.status(200).json({
            status: "success",
            data: subcategory,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: "fail",
            error: "Internal Server Error",
        });
    }
});
// delete SubCategory
export const deleteSubCategoryById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const delSubCategory = await SubCategory.findByIdAndDelete(id);
        if (!delSubCategory) {
            return res.json({ status: "fail", message: "SubCategory not Found" });
        }
        res.json({
            status: "success",
            message: "SubCategory deleted successfully!",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};




