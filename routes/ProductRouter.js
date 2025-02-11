import express from "express";
import {
  createProducts,
  getAllProducts,
  getProductsById,
  deleteproductsById,
  searchProduct,
  getProductbyCategorId,
  getProductbysubCategoryId,
  getProductbybrandId,
  getProductsByCategory,
  getBestSellers,
  getProductsBySellerId,
  updateProducts,
  getAccountProducts,
  getMicrosoftProducts,getKeysProducts
} from "../controller/ProductController.js";
const productRouter = express.Router();

productRouter.route("/create").post(createProducts);
productRouter.route("/getAll").get(getAllProducts);
productRouter.route("/search").get(searchProduct);
productRouter.route("/get/:id").get(getProductsById);
productRouter.route("/category/:categoryId").get(getProductbyCategorId);
productRouter.route("/category/:categoryId").get(getProductbyCategorId);
productRouter.route("/brand/:brandId").get(getProductbybrandId);
productRouter.route("/productByCategory").get(getProductsByCategory);
productRouter.route("/productBySeller/:sellerId").get(getProductsBySellerId);
productRouter
  .route("/subcategory/:subcategoryId")
  .get(getProductbysubCategoryId);
productRouter.route("/delete/:id").delete(deleteproductsById);
productRouter.route("/update/:id").put(updateProducts);
productRouter.route("/getBestSellers").get(getBestSellers);
productRouter.route("/getProductByAccount").get(getAccountProducts);
productRouter.route("/getProductByMicrosoft").get(getMicrosoftProducts);
productRouter.route("/getProductByKey").get(getKeysProducts);
export default productRouter;
