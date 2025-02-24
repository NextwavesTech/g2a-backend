import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Checkout } from "../model/Checkout.js";
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
    const data = await Checkout.findById(id);

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
    const checkout = await Checkout.find();
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
    const delCheckout = await Checkout.findByIdAndDelete(id);
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
          { path: "categoryId", model: "Category" },
          { path: "brandId", model: "Brand" },
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
