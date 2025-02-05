import express from "express";
import {
  createProducts,
  getAllProducts,
  getProductsById,
  deleteproductsById,
  searchProduct,getProductbyCategorId,getProductbysubCategoryId,getProductbybrandId,getProductsByCategory,getBestSellers
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

productRouter.route("/subcategory/:subcategoryId").get(getProductbysubCategoryId);
productRouter.route("/delete/:id").delete(deleteproductsById);
productRouter.route('/getBestSellers').get(getBestSellers)
export default productRouter;
