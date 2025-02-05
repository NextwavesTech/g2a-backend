import express from "express";

import {
  createBlog,
  getBlogById,
  getAllBlogs,
  deleteBlogById,updateBlog
} from "../controller/BlogController.js";

const blogRouter = express.Router();

blogRouter.route("/create").post(createBlog);
blogRouter.route("/getAll").get(getAllBlogs);
blogRouter.route("/update/:id").put(updateBlog);
blogRouter.route("/get/:id").get(getBlogById);
blogRouter.route("/delete/:id").delete(deleteBlogById);

export default blogRouter;
