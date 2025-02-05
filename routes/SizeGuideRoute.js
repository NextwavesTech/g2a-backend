import express from "express";
import {createSizeGuide,getAllSize,updateSizeGuide,getSizeById,deleteSizeGuidesById} from '../controller/SizeController.js'
const sizeRouter = express.Router();

sizeRouter.route("/create").post(createSizeGuide);
sizeRouter.route("/getAll").get(getAllSize);
sizeRouter.route("/update/:id").put(updateSizeGuide);
sizeRouter.route("/get/:id").get(getSizeById);
sizeRouter.route("/delete/:id").delete(deleteSizeGuidesById);

export default sizeRouter;
