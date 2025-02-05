import express from "express";

import {createFaq,getAllFaq,getFaqById,deleteFaqById,updateFaq} from '../controller/FaqController.js'

const FaqRouter = express.Router();

FaqRouter.route("/create").post(createFaq);
FaqRouter.route("/getAll").get(getAllFaq);
FaqRouter.route("/get/:id").get(getFaqById);
FaqRouter.route("/update/:id").put(updateFaq);
FaqRouter.route("/delete/:id").delete(deleteFaqById);


export default FaqRouter;
