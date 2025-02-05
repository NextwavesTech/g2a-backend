import express from "express";
import {
  createUpcoming,
  getAllUpcoming,
  getUpcoming,
  updateUpcoming,
  deleteUpcoming,
} from "../controller/UpcomingCpntroller.js";
const upcomingRouter = express.Router();
upcomingRouter.route("/create").post(createUpcoming);
upcomingRouter.route("/getAll").get(getAllUpcoming);
upcomingRouter.route("/get/:id").get(getUpcoming);
upcomingRouter.route("/update/:id").put(updateUpcoming);
upcomingRouter.route("/delete/:id").delete(deleteUpcoming);
export default upcomingRouter;
