import express from "express";
import {
  createWithdraw,
  getAllWithdraws,
  updateWithdrawStatus,
} from "../controller/WithDrawController.js";
const withDrawRoute = express.Router();

withDrawRoute.route("/create").post(createWithdraw);

withDrawRoute.route("/update/:id").put(updateWithdrawStatus);
withDrawRoute.route("/getAll").get(getAllWithdraws);

export default withDrawRoute;
