import express from "express";
import {
  createRegion,
  getAllRegion,
  getRegionById,
  deleteRegion,
  updateRegion,
} from "../controller/RegionController.js";

const regionRoute = express.Router();

regionRoute.route("/create").post(createRegion);
regionRoute.route("/getAll").get(getAllRegion);
regionRoute.route("/update/:id").put(updateRegion);
regionRoute.route("/get/:id").get(getRegionById);
regionRoute.route("/delete/:id").delete(deleteRegion);



export default regionRoute;
