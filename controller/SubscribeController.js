import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Subscribe } from "../model/subscribe.js";
import jwt from "jsonwebtoken";

export const subscribeCreation = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const email = data?.email;
  const existingUser = await Subscribe.findOne({ email: email });

  if (existingUser) {
    res
      .status(400)
      .json({ message: "You already subscribed!", status: "fail" });
  } else {
    const subscribe = await Subscribe.create(data);
    res.status(200).json({
      status: "success",
      message: "Subscribed successfully",
      data: subscribe,
    });
  }
});

export const getAllSubscribtion = catchAsyncError(async (req, res, next) => {
  try {
    const users = await Subscribe.find();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});
