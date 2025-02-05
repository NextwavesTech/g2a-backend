import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { FAQ } from "../model/Faq.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: "ddu4sybue",
    api_key: "658491673268817",
    api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});


// create FAQ
export const createFaq = catchAsyncError(async (req, res, next) => {
    const data = req.body;
  
    console.log(data);
    const newBlog = await FAQ.create(data);
    res.status(200).json({
        status: "success",
        message: "FAQ created successfully!",
        data: newBlog,
    });

});

export const updateFaq = catchAsyncError(async (req, res, next) => {
    const data = req.body;
    const faqId = req.params.id;
  
    const updatedFaq = await FAQ.findByIdAndUpdate(faqId, data, {
      new: true,
    });
    if (!updatedFaq) {
      return res.status(404).json({ message: "FAq not found" });
    }
    
  
  
    res.status(200).json({
      status: 'success',
      data: updatedFaq,
      message: "Faq updated successfully!",
    });
  });

// get faq by id
export const getFaqById = async (req, res, next) => {
    const id = req?.params.id;
    try {
        const data = await FAQ.findById(id);

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




// Get All Faq
export const getAllFaq = catchAsyncError(async (req, res, next) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json({
            status: "success",
            data: faqs,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: "fail",
            error: "Internal Server Error",
        });
    }
});
// delete faq
export const deleteFaqById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const delFaq = await FAQ.findByIdAndDelete(id);
        if (!delFaq) {
            return res.json({ status: "fail", message: "FAQ not Found" });
        }
        res.json({
            status: "success",
            message: "FAQ deleted successfully!",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};




