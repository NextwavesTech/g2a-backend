import { catchAsyncError } from "../middleware/catchAsyncError.js";
// import { User } from "../model/User.js";
import { Sellers } from "../model/sellers.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// register user
export const register = catchAsyncError(async (req, res, next) => {
  let image = req.files.cnicFront;
  let image1 = req.files.cnicBack;
  let image2 = req.files.logo;
  const data = req.body;
  const email = data?.email;
  const existingUser = await Sellers.findOne({ email: email });
  console.log();
  if (!image) {
    return res.status(400).json({
      status: "fail",
      message: "Please Select CNIC Front Image!",
    });
  }
  if (!image1) {
    return res.status(400).json({
      status: "fail",
      message: "Please Select CNIC Back Image!",
    });
  }
  if (!image2) {
    return res.status(400).json({
      status: "fail",
      message: "Please Select Logo Image!",
    });
  }
  const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
  const result1 = await cloudinary.v2.uploader.upload(image1.tempFilePath);
  const result2 = await cloudinary.v2.uploader.upload(image2.tempFilePath);
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email already exist", status: "fail" });
  } else {
    const data1 = {
      ...data,
      cnicFront: result.url,
      cnicBack: result1.url,
      logo: result2.url,
    };

    const user = await Sellers.create(data1);

    res.status(200).json({
      status: "success",
      message: "Seller registered successfully",
      data: user,
    });
  }
});

// login user
export const login = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await Sellers.findOne({ email: email });
    if (!existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "Account not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "seller login successfully",
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
  // console.log('user id ====', req?.user?.userId)
  try {
    // const cachedUser = await redisClient.get(`user:${userId}`);
    // if (cachedUser) {
    //   return res.json(JSON.parse(cachedUser)); // Return cached user
    // }
    const data = await Sellers.findById(userId);
    // await redisClient.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);
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
  const data = req.body;
  const userId = req.params.id;

  const updatedUser = await Sellers.findByIdAndUpdate(userId, data, {
    new: true,
  });
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  // await redisClient.set(`user:${userId}`, JSON.stringify(updatedUser), 'EX', 3600);
  // await producer.connect();
  // await producer.send({
  //   topic: 'user-events',
  //   messages: [{ value: JSON.stringify({ action: 'update', updatedUser }) }],
  // });

  // if (updatedUser?.status === "approved") {
  // }
  res.status(200).json({
    status: 200,
    data: updatedUser,
    message: "seller updated successfully!",
  });
});

// Get All User
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  try {
    const users = await Sellers.find();
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
    const delCustomer = await Sellers.findByIdAndDelete(id);
    if (!delCustomer) {
      return res.json({ status: "fail", message: "Seller not Found" });
    }
    // await redisClient.del(`user:${id}`);
    // await producer.connect();
    // await producer.send({
    //   topic: 'user-events',
    //   messages: [{ value: JSON.stringify({ action: 'delete', id }) }],
    // });
    res.json({
      status: "success",
      message: "Seller deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
