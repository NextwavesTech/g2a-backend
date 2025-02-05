import express from "express";

import {
  AddWishlist,
  deleteById,
  getAll,
  getById,
} from "../controller/WishlistController.js";
const wishlistRoute = express.Router();

wishlistRoute.route("/add").post(AddWishlist);

wishlistRoute.route("/get/:id").get(getById);
wishlistRoute.route("/remove").post(deleteById);
wishlistRoute.route("/getAll").get(getAll);

export default wishlistRoute;
