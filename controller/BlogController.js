import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Blogs } from "../model/Blog.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// create blog
export const createBlog = catchAsyncError(async (req, res, next) => {
  let image = req.files.image;
  const data = req.body;
  const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
  const slider = result.url;
  let data1 = {
    image: slider,
    content: data?.content,
    title: data?.title,
    shortDescription: data?.shortDescription,
    sellerId: data?.sellerId,
  };
  // console.log(data1);
  const newBlog = await Blogs.create(data1);
  res.status(200).json({
    status: "success",
    message: "New blog created successfully!",
    data: newBlog,
  });
});

// get blog by id
export const getBlogById = async (req, res, next) => {
  const id = req?.params.id;
  try {
    const data = await Blogs.findById(id);

    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
};
// update blog
export const updateBlog = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const blogId = req.params.id;

  const updatedblog = await Blogs.findByIdAndUpdate(blogId, data, {
    new: true,
  });
  if (!updatedblog) {
    return res.status(404).json({ message: "blog not found" });
  }

  res.status(200).json({
    status: "success",
    data: updatedblog,
    message: "blog updated successfully!",
  });
});

// Get All blogs
// export const getAllBlogs = catchAsyncError(async (req, res, next) => {
//   try {
  
//     const blogs = await Blogs.aggregate([
//       {
//         $lookup: {
//           from: "subcategories",
//           localField: "_id",
//           foreignField: "categoryId",
//           as: "subcategories",
//         },
//       },
//     ]);
//     res.status(200).json({
//       status: "success",
//       data: blogs,
//     });
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     res.status(500).json({
//       status: "fail",
//       error: "Internal Server Error",
//     });
//   }
// });
export const getAllBlogs = catchAsyncError(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const blogs = await Blogs.aggregate([
      { $skip: skip },
      { $limit: limit },
    ]);
    const totalBlogs = await Blogs.countDocuments();

    res.status(200).json({
      status: "success",
      data: blogs,
      pagination: {
        total: totalBlogs,
        page,
        limit,
        totalPages: Math.ceil(totalBlogs / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs with pagination:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});



// delete blog
export const deleteBlogById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delBlog = await Blogs.findByIdAndDelete(id);
    if (!delBlog) {
      return res.json({ status: "fail", message: "Blog not Found" });
    }
    res.json({
      status: "success",
      message: "Blog deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};






