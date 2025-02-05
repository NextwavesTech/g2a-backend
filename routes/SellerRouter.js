import express from "express";
import { register,login,getAllUsers,UpdateProfile,deleteCustomerById,getUserById } from "../controller/SellerController.js";
const sellerRoute = express.Router();

sellerRoute.route("/register").post(register);
sellerRoute.route("/login").post(login);
sellerRoute.route("/getAll").get(getAllUsers);

sellerRoute.route("/get/:id").get(getUserById);
sellerRoute.route("/update/:id").put(UpdateProfile);
sellerRoute.route("/delete/:id").delete(deleteCustomerById);

export default sellerRoute;
