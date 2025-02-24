import express from "express";

import {
  createCheckout,
  getCheckoutById,
  updateCheckout,
  getAllCheckout,
  deleteCheckoutById,getUserCheckouts
} from "../controller/CheckoutController.js";
const checkoutRouter = express.Router();

checkoutRouter.route("/create").post(createCheckout);
checkoutRouter.route("/getAll").get(getAllCheckout);
checkoutRouter.route("/update/:id").put(updateCheckout);
checkoutRouter.route("/get/:id").get(getCheckoutById);
checkoutRouter.route("/getByUser/:userId").get(getUserCheckouts);
checkoutRouter.route("/delete/:id").delete(deleteCheckoutById);

export default checkoutRouter;
