import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminById,
  deleteCustomerById,
  getAllAdmin,
  UpdateProfile,
} from "../controller/AdminController.js";
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "somesecretsecret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const adminRoute = express.Router();

adminRoute.route("/create").post(registerAdmin);
adminRoute.route("/login").post(loginAdmin);
adminRoute.route("/getAll").get(getAllAdmin);
adminRoute.route("/get/:id").get(getAdminById);
adminRoute.route("/update/:id").put(UpdateProfile);
adminRoute.route("/delete/:id").delete(deleteCustomerById);

export default adminRoute;
