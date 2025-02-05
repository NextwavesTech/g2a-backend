import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Products } from "../model/Product.js";
// import { Category } from "../model/category.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// create Products
export const createProducts = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  let images = [];
  if (req.files && req.files.images) {
    if (!Array.isArray(req.files.images)) {
      images.push(req.files.images);
    } else {
      images = req.files.images;
    }
  }
  let responce = [];
  for (const image of images) {
    try {
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
      const url = result.url;
      responce.push(url);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error uploading images" });
    }
  }
  let data1 = {
    images: responce,
    ...data,
  };
  // console.log(data1);
  const newProducts = await Products.create(data1);
  res.status(200).json({
    status: "success",
    message: "New Product created successfully!",
    data: newProducts,
  });
});

// get Products by id
export const getProductsById = async (req, res, next) => {
  const id = req?.params.id;
  try {
    const data = await Products.findById(id)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId").populate('sellerId');

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
// update Products
export const updateProducts = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const productsId = req.params.id;

  const updatedProducts = await Products.findByIdAndUpdate(productsId, data, {
    new: true,
  });
  if (!updatedProducts) {
    return res.status(404).json({ message: "Products not found" });
  }

  res.status(200).json({
    status: "success",
    data: updatedProducts,
    message: "Products updated successfully!",
  });
});

// Get All Products
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const limit = 10; // Number of blogs per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const products = await Products.find()
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId")
      .skip(skip)
      .limit(limit);
    const totalproducts = await Products.countDocuments();
    res.status(200).json({
      status: "success",
      data: {
        data: products,
        currentPage: page,
        totalPages: Math.ceil(totalproducts / limit),
        totalproducts,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});
export const searchProduct = catchAsyncError(async (req, res, next) => {
  const { title } = req.query;

  try {
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const products = await Products.find({
      title: { $regex: title, $options: "i" },
    });

    res.status(200).json({ data: products, status: "success" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
export const getProductbybrandId = async (req, res, next) => {
  const brandId = req?.params.brandId;
  try {
    const data = await Products.find({ brandId: brandId })
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId");
    // const cateforyData = await await Category.findById(categoryId);
    res.json({
      status: "success",
      data: data,
      // category: cateforyData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
};
export const getProductbyCategorId = async (req, res, next) => {
  const categoryId = req?.params.categoryId;
  try {
    const data = await Products.find({ categoryId: categoryId })
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId");
    // const cateforyData = await await Category.findById(categoryId);
    res.json({
      status: "success",
      data: data,
      // category: cateforyData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
};
export const getProductbysubCategoryId = async (req, res, next) => {
  const categoryId = req?.params.subcategoryId;
  try {
    const data = await Products.find({ subCategoryId: categoryId })
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId");
    // const cateforyData = await await Category.findById(categoryId);
    res.json({
      status: "success",
      data: data,
      // category: cateforyData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
};
// delete products
export const deleteproductsById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delProducts = await Products.findByIdAndDelete(id);
    if (!delProducts) {
      return res.json({ status: "fail", message: "Product not Found" });
    }
    res.json({
      status: "success",
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    // Aggregation pipeline to fetch products with nested category data
    const products = await Products.aggregate([
      // Lookup Brand data
      {
        $lookup: {
          from: "brands", // Collection name for Brands
          localField: "brandId", // Field in Products
          foreignField: "_id", // Field in Brands
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },

      // Lookup MidCategory data
      {
        $lookup: {
          from: "midcategories", // Collection name for MidCategory
          localField: "categoryId", // Field in Products
          foreignField: "_id", // Field in MidCategory
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // Lookup SubCategory data
      {
        $lookup: {
          from: "subcategories", // Collection name for SubCategory
          localField: "subCategoryId", // Field in Products
          foreignField: "_id", // Field in SubCategory
          as: "subCategory",
        },
      },
      { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

      // Group products by category
      {
        $group: {
          _id: "$category._id",
          categoryTitle: { $first: "$category.title" },
          brandName: { $first: "$brand.name" },
          products: {
            $push: {
              _id: "$_id",
              title: "$title",
              images: "$images",
              actualPrice: "$actualPrice",
              discountPrice: "$discountPrice",
              gst: "$gst",
              description: "$description",
              createdAt: "$createdAt",
              status: "$status",
              subCategoryTitle: "$subCategory.title",
            },
          },
        },
      },

      // Pagination: skip and limit
      { $skip: skip },
      { $limit: limit },
    ]);

    // Count total products
    const totalProducts = await Products.countDocuments();

    // Send response
    res.status(200).json({
      status: "success",
      data: products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};
