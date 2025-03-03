import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/User.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// register user
export const register = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const email = data?.email;
  const existingUser = await User.findOne({ email: email });
  console.log();

  if (existingUser) {
    res.status(400).json({ message: "Email already exist", status: "fail" });
  } else {
    const user = await User.create(data);

    res.status(200).json({
      status: "success",
      message: "User registered successfully",
      data: user,
    });
  }
});

// login user
export const login = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "Account not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "user login successfully",
      data: existingUser,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});
// verify otp

// get user by id
export const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {

    const data = await User.findById(userId);
    res.json({
      status: 200,
      data: data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// Update Profile
export const UpdateProfile = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    let updatedFields = { ...data };

    if (req.files && req.files.image) {
      let image = req.files.image;
      const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
      updatedFields.logo = result.url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: 200,
      data: user,
      message: "Profile updated successfully!",
    });
  } catch (err) {
    console.log("response from server error", err);
  }
});

// Get All User
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  try {
    const users = await User.find();
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
// delete user
export const deleteCustomerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delCustomer = await User.findByIdAndDelete(id);
    if (!delCustomer) {
      return res.json({ status: "fail", message: "Customer not Found" });
    }
   
    res.json({
      status: "success",
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
