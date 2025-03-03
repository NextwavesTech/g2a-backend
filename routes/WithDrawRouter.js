import express from "express";
import {
  createWithdraw,
  getAllWithdraws,
  updateWithdrawStatus,getSellerWithdraws
} from "../controller/WithDrawController.js";
const withDrawRoute = express.Router();

withDrawRoute.route("/create").post(createWithdraw);
withDrawRoute.route("/getBySellerId/:sellerId").get(getSellerWithdraws);
withDrawRoute.route("/update/:id").put(updateWithdrawStatus);
withDrawRoute.route("/getAll").get(getAllWithdraws);

export default withDrawRoute;
