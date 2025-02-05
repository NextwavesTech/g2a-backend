import express from "express";

import { createSlider,getAllsliders,getSliderById,deleteSliderById } from "../controller/HomeSlidersController.js";



const sliderRouter = express.Router();

sliderRouter.route("/create").post(createSlider);
sliderRouter.route("/getAll").get(getAllsliders);
sliderRouter.route("/get/:id").get(getSliderById);
sliderRouter.route("/delete/:id").delete(deleteSliderById);


export default sliderRouter;
