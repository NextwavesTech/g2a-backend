import express from "express";

import {createBundleDeals,updatenewBundleDeals, deleteBundleDeals, getbundleDealsById, getBundleDeals, approvebundleDeals, addProductTobundleDeals, removeProductFrombundleDeals, getProductbybundleDeal} from '../controller/BundleDealsController.js'
const bundleDealsRouter = express.Router();

bundleDealsRouter.route("/create").post(createBundleDeals);
bundleDealsRouter.route("/getAll").get(getBundleDeals);
bundleDealsRouter.route("/get/:id").get(getbundleDealsById);
bundleDealsRouter.route("/delete/:id").delete(deleteBundleDeals);
bundleDealsRouter.route("/approve/:id").put(approvebundleDeals);
bundleDealsRouter.route("/addProduct/:id").put(addProductTobundleDeals);
bundleDealsRouter.route("/removeProduct/:id").put(removeProductFrombundleDeals);
bundleDealsRouter.route("/getProduct/:id").get(getProductbybundleDeal);

export default bundleDealsRouter;