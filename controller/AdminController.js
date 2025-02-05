import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Admin } from "../model/admin.js";
import jwt from "jsonwebtoken";

// register admin
export const registerAdmin = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const email = data?.email;
  const existingUser = await Admin.findOne({ email: email });

  if (existingUser) {
    res.status(400).json({ message: "Email already exist", status: "fail" });
  } else {
    const user = await Admin.create(data);
    // const user = new User(data);
    // await user.save();
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "somesecretsecret",
      { expiresIn: "30d" }
    );
    // await redisClient.set(`user:${user._id}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour

    // // Send Kafka event
    // await producer.connect();
    // await producer.send({
    //   topic: 'user-events',
    //   messages: [{ value: JSON.stringify({ action: 'create', user }) }],
    // });
    res.status(200).json({
      status: "success",
      message: "New Admin Created successfully",
      token: token,
      data: user,
    });
  }
});

// login login
export const loginAdmin = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Admin.findOne({ email: email });
    if (!existingUser) {
      res.status(400).json({ message: "Admin not exist", status: 'fail' });
    }
    const user = await Admin.findOne({email, password});
    console.log("response from reveir data ===", user);
    if (!user) {
      res.status(400).json({ message: "Password does not match", status: 'fail' });
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "somesecretsecret",
      { expiresIn: "30d" }
    );
    res.status(200).json({
      status: "success",
      token: token,
      message: "Admin login successfully",
      data: user,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// get Admin by id
export const getAdminById = async (req, res, next) => {
  const userId = req.params.id;
  // console.log('user id ====', req?.user?.userId)
  try {
    // const cachedUser = await redisClient.get(`user:${userId}`);
    // if (cachedUser) {
    //   return res.json(JSON.parse(cachedUser)); // Return cached user
    // }
    const data = await Admin.findById(userId);
    // await redisClient.set(`user:${userId}`, JSON.stringify(data), "EX", 3600);
    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// Update admin
export const UpdateProfile = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const userId = req.params.id;

  const updatedUser = await Admin.findByIdAndUpdate(userId, data, {
    new: true,
  });
  if (!updatedUser) {
    return res.status(404).json({ message: "Admin not found" });
  }
  // await redisClient.set(
  //   `user:${userId}`,
  //   JSON.stringify(updatedUser),
  //   "EX",
  //   3600
  // );
  // await producer.connect();
  // await producer.send({
  //   topic: "user-events",
  //   messages: [{ value: JSON.stringify({ action: "update", updatedUser }) }],
  // });
  res.status(200).json({
    status: "success",
    data: updatedUser,
    message: "Admin Updated Successfully!",
  });
});

// Get All Admin
export const getAllAdmin = catchAsyncError(async (req, res, next) => {
  try {
    const users = await Admin.find();
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
// delet user
export const deleteCustomerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delCustomer = await Admin.findByIdAndDelete(id);
    if (!delCustomer) {
      return res.json({ status: "fail", message: "Admin not Found" });
    }
    // await redisClient.del(`user:${id}`);
    // await producer.connect();
    // await producer.send({
    //   topic: 'user-events',
    //   messages: [{ value: JSON.stringify({ action: 'delete', id }) }],
    // });
    res.json({
      status: "success",
      message: "Admin deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
