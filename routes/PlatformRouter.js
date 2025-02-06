import express from "express";
import {
  createPlatform,
  getAllPlatforms,
  getPlatformById,
  updatePlatformById,
  deletePlatformById,
} from "../controller/PlatformController.js";

const platformRouter = express.Router();

platformRouter.route("/create").post(createPlatform);
platformRouter.route("/getAll").get(getAllPlatforms);
platformRouter.route("/get/:id").get(getPlatformById);
platformRouter.route("/update/:id").put(updatePlatformById);
platformRouter.route("/delete/:id").delete(deletePlatformById);

export default platformRouter;
