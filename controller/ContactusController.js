import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ContactUs } from "../model/ContactUs.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

// contact us create
export const create = catchAsyncError(async (req, res, next) => {
  const data = req.body;

  const newContact = await ContactUs.create(data);

  res.status(200).json({
    status: "success",
    message: "Your request send to team successfully",

    data: newContact,
  });
});



 


// Get All Contact
export const getAllContact = catchAsyncError(async (req, res, next) => {
  try {
    const contacts = await ContactUs.find();
    res.status(200).json({
      status: "success",
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
    });
  }
});
// delet Contact us
export const deleteContactById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delContact = await ContactUs.findByIdAndDelete(id);
    if (!delContact) {
      return res.json({ status: "fail", message: "Contact us not Found" });
    }
    res.json({
      status: "success",
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};




