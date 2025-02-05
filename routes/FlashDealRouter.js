import express from "express";
import {
  createFlashDeals,
  getFlashDeals,
  getFlashDealsById,
  deleteFlashDeals,
  approveFlashDeals,
  addProductToFlashDeals,
  removeProductFromFlashDeals,
  getProductbyFlashDeal,
} from "../controller/FlashDeals.js";
const flashDealsRouter = express.Router();

flashDealsRouter.route("/create").post(createFlashDeals);
flashDealsRouter.route("/getAll").get(getFlashDeals);
flashDealsRouter.route("/get/:id").get(getFlashDealsById);
flashDealsRouter.route("/delete/:id").delete(deleteFlashDeals);
flashDealsRouter.route("/approve/:id").put(approveFlashDeals);
flashDealsRouter.route("/addProduct/:id").put(addProductToFlashDeals);
flashDealsRouter.route("/removeProduct/:id").put(removeProductFromFlashDeals);
flashDealsRouter.route("/getProduct/:id").get(getProductbyFlashDeal);

export default flashDealsRouter;