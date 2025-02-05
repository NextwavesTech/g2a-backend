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
