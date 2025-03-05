import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Checkout } from "../model/Checkout.js";
import {Products } from "../model/Product.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// create Checkout
export const createCheckout = catchAsyncError(async (req, res, next) => {
  const data = req.body;


  // console.log(data1);
  // const data = req.body;

  const newCheckout = await Checkout.create(data);
  res.status(200).json({
    status: "success",
    message: "Your Order has been placed successfully!",
    data: newCheckout,
  });
});

// get Checkout by id
export const getCheckoutById = async (req, res, next) => {
  const id = req?.params.id;
  try {
    const data = await Checkout.findById(id).populate('userId').populate({
      path: "productIds",
      model: "Products",
      populate: [
        { path: "categoryId", model: "MidCategory" },
        { path: "subCategoryId", model: "SubCategory" },
        { path: "brandId", model: "Brands" },
        { path: "platform", model: "Platform" },
        { path: "region", model: "Region" }
      ]
    });

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
// update Checkout
export const updateCheckout = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const orderId = req.params.id;

  const updatedCheckout = await Checkout.findByIdAndUpdate(orderId, data, {
    new: true,
  });
  if (!updatedCheckout) {
    return res.status(404).json({ message: "blog not found" });
  }

  res.status(200).json({
    status: "success",
    data: updatedCheckout,
    message: "Checkout updated successfully!",
  });
});

// Get All Checkout
export const getAllCheckout = catchAsyncError(async (req, res, next) => {
  try {
    const checkout = await Checkout.find().populate('userId')
    res.status(200).json({
      status: "success",
      data: checkout,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});
// delete checkout
export const deleteCheckoutById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delCheckout = await Checkout.findByIdAndDelete(id).populate({
      path: "productIds",
      model: "Products",
      populate: [
        { path: "categoryId", model: "Category" },
        { path: "brandId", model: "Brand" },
        { path: "platform", model: "Platform" },
        { path: "region", model: "Region" }
      ]
    });
    if (!delCheckout) {
      return res.json({ status: "fail", message: "Checkout not Found" });
    }
    res.json({
      status: "success",
      message: "Checkout deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getUserCheckouts = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const checkouts = await Checkout.find({ userId })
      .populate({
        path: "productIds",
        model: "Products",
        populate: [
          { path: "categoryId", model: "MidCategory" },
          { path: "brandId", model: "Brands" },
          { path: "platform", model: "Platform" },
          { path: "region", model: "Region" }
        ]
      }) // Fully populate products with category, brand, platform, and region
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalCheckouts = await Checkout.countDocuments({ userId });
    const totalPages = Math.ceil(totalCheckouts / limit);

    res.status(200).json({
      status: "success",
      data: checkouts,
      pagination: {
        total: totalCheckouts,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    res.status(500).json({ status: "fail", error: "Internal Server Error" });
  }
};


export const getSellerCheckouts = async (req, res) => {
  try {
    const { sellerId } = req.params; // Get sellerId from URL params
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Find checkouts where at least one product belongs to the seller
    const checkouts = await Checkout.find()
      .populate({
        path: "productIds",
        model: "Products",
        match: { sellerId }, // Filter products by sellerId
        populate: [
          { path: "categoryId", model: "MidCategory" },
          { path: "subCategoryId", model: "SubCategory" },
          { path: "brandId", model: "Brands" },
          { path: "platform", model: "Platform" },
          { path: "region", model: "Region" },
        ],
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(parseInt(limit));

    // Filter out checkouts that have no matching products
    const filteredCheckouts = checkouts.filter(
      (checkout) => checkout.productIds.length > 0
    );

    // Count total checkouts for the seller
    const totalCheckouts = await Checkout.countDocuments({
      productIds: { $in: await getProductIdsBySeller(sellerId) },
    });

    const totalPages = Math.ceil(totalCheckouts / limit);

    res.status(200).json({
      status: "success",
      data: filteredCheckouts,
      pagination: {
        total: totalCheckouts,
        totalPages,
        currentPage: parseInt(page),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching seller checkouts:", error);
    res.status(500).json({ status: "fail", error: "Internal Server Error" });
  }
};
const getProductIdsBySeller = async (sellerId) => {
  const products = await Products.find({ sellerId }, "_id");
  return products.map((product) => product._id);
};
