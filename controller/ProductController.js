import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Products } from "../model/Product.js";
import {Platform} from '../model/Platform.js'
// import { Category } from "../model/category.js";
import cloudinary from "cloudinary";
import { Rating } from "../model/rating.js";

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
      .populate("brandId")
      .populate({ path: "platform", model: "Platform" })
      .populate({ path: "region", model: "Region" })
      .populate("sellerId");

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
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const sortOption = getSortOption(req.query.sort);

    let filter = {};

    // Apply filters
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;
    if (req.query.subCategoryId) filter.subCategoryId = req.query.subCategoryId;
    if (req.query.brandId) filter.brandId = req.query.brandId;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.region) filter.region = req.query.region;
    if (req.query.title) filter.title = new RegExp(req.query.title, "i");

    // Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.discountPrice = {};
      if (req.query.minPrice) filter.discountPrice.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.discountPrice.$lte = parseFloat(req.query.maxPrice);
    }

    // Handle platform title search
    if (req.query.platform) {
      const platformData = await Platform.findOne({ title: req.query.platform });
      if (platformData) {
        filter.platform = platformData._id;
      } else {
        return res.status(404).json({ status: "fail", message: "Platform not found" });
      }
    }

    // Fetch products with filters and sorting
    const products = await Products.find(filter)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId")
      .populate("sellerId")
      .populate("platform")
      .populate("region")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      status: "success",
      data: products,
      pagination: {
        total: totalProducts,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
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
const getSortOption = (sort) => {
  switch (sort) {
    case "releaseDate-asc":
      return { createdAt: 1 }; // Oldest first
    case "releaseDate-desc":
      return { createdAt: -1 }; // Newest first
    case "price-asc":
      return { discountPrice: 1 }; // Lowest price first
    case "price-desc":
      return { discountPrice: -1 }; // Highest price first
    default:
      return { createdAt: -1 }; // Default: Newest first
  }
};

export const getProductbybrandId = async (req, res, next) => {
  const { brandId } = req.params;
  const { page = 1, categoryId, platform, minPrice, maxPrice, type, region, title, sort } = req.query;
  const limit = 12;
  const skip = (page - 1) * limit;
  const sortOption = getSortOption(sort);

  try {
    let filter = { brandId };

    if (categoryId) filter.categoryId = categoryId;
    if (platform) filter.platform = platform;
    if (type) filter.type = type;
    if (region) filter.region = region;
    if (title) filter.title = new RegExp(title, "i");
    if (minPrice || maxPrice) {
      filter.discountPrice = {};
      if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
    }

    const data = await Products.find(filter)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId")
      .populate("platform")
      .populate("region")
      .sort(sortOption) // Apply sorting
      .skip(skip)
      .limit(limit);

    const total = await Products.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: "success",
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: "Internal Server Error" });
  }
};

// Repeat the same logic for other functions
export const getProductbyCategorId = async (req, res, next) => {
  const { categoryId } = req.params;
  const { page = 1, platform, minPrice, maxPrice, type, region, title, sort } = req.query;
  const limit = 12;
  const skip = (page - 1) * limit;
  const sortOption = getSortOption(sort);

  try {
    let filter = { categoryId };

    if (platform) filter.platform = platform;
    if (type) filter.type = type;
    if (region) filter.region = region;
    if (title) filter.title = new RegExp(title, "i");
    if (minPrice || maxPrice) {
      filter.discountPrice = {};
      if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
    }

    const data = await Products.find(filter)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId")
      .populate("platform")
      .populate("region")
      .sort(sortOption) // Apply sorting
      .skip(skip)
      .limit(limit);

    const total = await Products.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: "success",
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: "Internal Server Error" });
  }
};

// Same sorting added to getProductbysubCategoryId
export const getProductbysubCategoryId = async (req, res, next) => {
  const { subcategoryId } = req.params;
  const { page = 1, platform, minPrice, maxPrice, type, region, title, sort } = req.query;
  const limit = 12;
  const skip = (page - 1) * limit;
  const sortOption = getSortOption(sort);

  try {
    let filter = { subCategoryId: subcategoryId };

    if (platform) filter.platform = platform;
    if (type) filter.type = type;
    if (region) filter.region = region;
    if (title) filter.title = new RegExp(title, "i");
    if (minPrice || maxPrice) {
      filter.discountPrice = {};
      if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
    }

    const data = await Products.find(filter)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId")
      .populate("platform")
      .populate("region")
      .sort(sortOption) // Apply sorting
      .skip(skip)
      .limit(limit);

    const total = await Products.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: "success",
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: "Internal Server Error" });
  }
};

// Same sorting added to getProductsBySellerId
export const getProductsBySellerId = async (req, res, next) => {
  const { sellerId } = req.params;
  const { page = 1, categoryId, platform, minPrice, maxPrice, type, region, title, sort } = req.query;
  const limit = 12;
  const skip = (page - 1) * limit;
  const sortOption = getSortOption(sort);

  try {
    let filter = { sellerId };

    if (categoryId) filter.categoryId = categoryId;
    if (platform) filter.platform = platform;
    if (type) filter.type = type;
    if (region) filter.region = region;
    if (title) filter.title = new RegExp(title, "i");
    if (minPrice || maxPrice) {
      filter.discountPrice = {};
      if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
    }

    const products = await Products.find(filter)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("brandId")
      .populate("sellerId")
      .populate("platform")
      .populate("region")
      .sort(sortOption) // Apply sorting
      .skip(skip)
      .limit(limit);

    const total = await Products.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: "success",
      data: products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: "Internal Server Error" });
  }
};

// export const getProductbybrandId = async (req, res, next) => {
//   const { brandId } = req.params;
//   const { page = 1, categoryId, platform, minPrice, maxPrice, type, region, title } = req.query;
//   const limit = 12;
//   const skip = (page - 1) * limit;

//   try {
//     let filter = { brandId };

//     if (categoryId) filter.categoryId = categoryId;
//     if (platform) filter.platform = platform;
//     if (type) filter.type = type;
//     if (region) filter.region = region;
//     if (title) filter.title = new RegExp(title, "i"); // Case-insensitive search
//     if (minPrice || maxPrice) {
//       filter.discountPrice = {};
//       if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
//     }

//     const data = await Products.find(filter)
//       .populate("categoryId")
//       .populate("subCategoryId")
//       .populate("brandId")
//       .populate("platform")
//       .populate("region")
//       .skip(skip)
//       .limit(limit);

//     const total = await Products.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     res.json({
//       status: "success",
//       data,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: page,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "fail", error: "Internal Server Error" });
//   }
// };

// export const getProductbyCategorId = async (req, res, next) => {
//   const { categoryId } = req.params;
//   const { page = 1, platform, minPrice, maxPrice, type, region, title } = req.query;
//   const limit = 12;
//   const skip = (page - 1) * limit;

//   try {
//     let filter = { categoryId };

//     if (platform) filter.platform = platform;
//     if (type) filter.type = type;
//     if (region) filter.region = region;
//     if (title) filter.title = new RegExp(title, "i");
//     if (minPrice || maxPrice) {
//       filter.discountPrice = {};
//       if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
//     }

//     const data = await Products.find(filter)
//       .populate("categoryId")
//       .populate("subCategoryId")
//       .populate("brandId")
//       .populate("platform")
//       .populate("region")
//       .skip(skip)
//       .limit(limit);

//     const total = await Products.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     res.json({
//       status: "success",
//       data,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: page,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "fail", error: "Internal Server Error" });
//   }
// };

// export const getProductbysubCategoryId = async (req, res, next) => {
//   const { subcategoryId } = req.params;
//   const { page = 1, platform, minPrice, maxPrice, type, region, title } = req.query;
//   const limit = 12;
//   const skip = (page - 1) * limit;

//   try {
//     let filter = { subCategoryId: subcategoryId };

//     if (platform) filter.platform = platform;
//     if (type) filter.type = type;
//     if (region) filter.region = region;
//     if (title) filter.title = new RegExp(title, "i");
//     if (minPrice || maxPrice) {
//       filter.discountPrice = {};
//       if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
//     }

//     const data = await Products.find(filter)
//       .populate("categoryId")
//       .populate("subCategoryId")
//       .populate("brandId")
//       .populate("platform")
//       .populate("region")
//       .skip(skip)
//       .limit(limit);

//     const total = await Products.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     res.json({
//       status: "success",
//       data,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: page,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "fail", error: "Internal Server Error" });
//   }
// };

// export const getProductsBySellerId = async (req, res, next) => {
//   const { sellerId } = req.params;
//   const { page = 1, categoryId, platform, minPrice, maxPrice, type, region, title } = req.query;
//   const limit = 12;
//   const skip = (page - 1) * limit;

//   try {
//     let filter = { sellerId };

//     if (categoryId) filter.categoryId = categoryId;
//     if (platform) filter.platform = platform;
//     if (type) filter.type = type;
//     if (region) filter.region = region;
//     if (title) filter.title = new RegExp(title, "i");
//     if (minPrice || maxPrice) {
//       filter.discountPrice = {};
//       if (minPrice) filter.discountPrice.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.discountPrice.$lte = parseFloat(maxPrice);
//     }

//     const products = await Products.find(filter)
//       .populate("categoryId")
//       .populate("subCategoryId")
//       .populate("brandId")
//       .populate("sellerId")
//       .populate("platform")
//       .populate("region")
//       .skip(skip)
//       .limit(limit);

//     const total = await Products.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     res.json({
//       status: "success",
//       data: products,
//       pagination: {
//         total,
//         totalPages,
//         currentPage: page,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "fail", error: "Internal Server Error" });
//   }
// };



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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const productPage = parseInt(req.query.productPage) || 1;
    const productLimit = parseInt(req.query.productLimit) || 6;
    const productSkip = (productPage - 1) * productLimit;
    const skip = (page - 1) * limit;

    // Extract filters from query parameters
    const title = req.query.title ? new RegExp(req.query.title, "i") : null;
    const categoryId = req.query.categoryId ? req.query.categoryId : null;
    const platformId = req.query.platformId ? req.query.platformId : null;
    const region = req.query.region ? req.query.region : null;
    const type = req.query.type ? req.query.type : null;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    // Construct the match stage for filtering
    let matchStage = {};

    if (title) matchStage.title = title;
    if (categoryId) matchStage.categoryId = categoryId;
    if (platformId) matchStage.platform = platformId;
    if (region) matchStage.region = region;
    if (type) matchStage.type = type;

    // Filter price range if min or max price is provided
    matchStage.discountPrice = {
      $gte: minPrice.toString(),
      $lte: maxPrice.toString(),
    };

    const products = await Products.aggregate([
      { $match: matchStage }, // Apply all filters

      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "midcategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: "$brand._id",
          brandName: { $first: "$brand.name" },
          totalProducts: { $sum: 1 },
          products: { $push: "$$ROOT" },
        },
      },

      {
        $project: {
          _id: 1,
          brandName: 1,
          totalProducts: 1,
          totalProductPages: { $ceil: { $divide: ["$totalProducts", productLimit] } },
          productPage: { $literal: productPage },
          productLimit: { $literal: productLimit },
          products: { $slice: ["$products", productSkip, productLimit] },
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]);

    // Count total brands
    const totalBrands = await Products.distinct("brandId").then((res) => res.length);

    res.status(200).json({
      status: "success",
      data: products,
      pagination: {
        totalBrands,
        page,
        limit,
        totalPages: Math.ceil(totalBrands / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};





export const getBestSellers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 6; // 6 items per page
    const skip = (page - 1) * limit;

    // Aggregate ratings to get the average rating and count per product
    const bestSellers = await Rating.aggregate([
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, totalRatings: -1 } }, // Sort by rating & total reviews
      { $skip: skip }, // Skip based on page
      { $limit: limit }, // Limit to 6 items per page
      {
        $lookup: {
          from: "products", // Reference the 'Products' collection
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Convert array to object
      {
        $project: {
          _id: "$productDetails._id",
          productDetails: 1, // Include all product fields
          averageRating: { $round: ["$averageRating", 1] }, // Round rating to 1 decimal
          totalRatings: 1,
        },
      },
    ]);

    // Count total best seller products
    const totalBestSellers = await Rating.aggregate([
      {
        $group: {
          _id: "$product",
        },
      },
      { $count: "total" },
    ]);

    const total = totalBestSellers.length > 0 ? totalBestSellers[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      currentPage: page,
      totalPages: totalPages,
      totalItems: total,
      data: bestSellers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export const getAccountProducts = catchAsyncError(async (req, res, next) => {
  try {
    const products = await Products.find({ type: "account" })
      .sort({ gst: -1 }) // Sort by GST in descending order
      .limit(4); // Get only top 4 products

    res.json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching account products" });
  }
});


export const getKeysProducts = catchAsyncError(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const products = await Products.find({ type: "key" })
     
      .skip(skip)
      .limit(limit);

    // Remove products where platform does not match "Microsoft"
    // const filteredProducts = products.filter(product => product.platform !== null);

    const totalItems = await Products.countDocuments({ type: "key" });

    res.json({
      status: "success",
      data: products,
      pagination: {
        totalItems: totalItems,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Microsoft products" });
  }
});

export const getMicrosoftProducts = catchAsyncError(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;

    const products = await Products.find()
      .populate({
        path: "platform",
        match: { title: "Microsoft" }, // Filtering products where platform name is "Microsoft"
      })
      .skip(skip)
      .limit(limit);

    // Remove products where platform does not match "Microsoft"
    const filteredProducts = products.filter(product => product.platform !== null);

    const totalItems = await Products.countDocuments({ platform: { $ne: null } });

    res.json({
      status: "success",
      data: filteredProducts,
      pagination: {
        totalItems: filteredProducts.length,
        currentPage: page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Microsoft products" });
  }
});

