import express from "express";

import {
  createBrand,
  getAllBrand,
  getBrandById,
  deleteBrandById,
  updateBrand,
} from "../controller/BrandController.js";
const brandRouter = express.Router();

brandRouter.route("/create").post(createBrand);
brandRouter.route("/getAll").get(getAllBrand);
brandRouter.route("/update/:id").put(updateBrand);
brandRouter.route("/get/:id").get(getBrandById);
brandRouter.route("/delete/:id").delete(deleteBrandById);

export default brandRouter;
