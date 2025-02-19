import express from "express";

import {
  createCategory,
  getCategoryById,
  getAllCategory,
  deleteCategoryById,
  updateCategory,getallcategoryforAdmin,getallcategoryByBrandId
} from "../controller/MidCategory.js";
import { getAllAdmin } from "../controller/AdminController.js";
const categoryRouter = express.Router();

categoryRouter.route("/create").post(createCategory);
categoryRouter.route("/getAll").get(getAllCategory);
categoryRouter.route("/getAllAdmin").get(getallcategoryforAdmin);
categoryRouter.route("/getByBrandId/:brandId").get(getallcategoryByBrandId);
categoryRouter.route("/update/:id").put(updateCategory);
categoryRouter.route("/get/:id").get(getCategoryById);
categoryRouter.route("/delete/:id").delete(deleteCategoryById);

export default categoryRouter;
