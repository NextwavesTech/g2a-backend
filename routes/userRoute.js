import express from "express";
import {
  register,
  login,
  getAllUsers,
  UpdateProfile,
  deleteCustomerById,
  getUserById,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.route("/register").post(register);
userRoute.route("/login").post(login);
userRoute.route("/getAll").get(getAllUsers);

userRoute.route("/get/:id").get(getUserById);
userRoute.route("/update/:id").put(UpdateProfile);
userRoute.route("/delete/:id").delete(deleteCustomerById);

export default userRoute;
