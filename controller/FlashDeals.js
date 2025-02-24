import { FlashDeals } from "../model/FlashDeals.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

export const createFlashDeals = async (req, res) => {
  let image = req.files.image;
  const data = req.body;
  const title = data?.title;
  const findName = await FlashDeals.findOne({ title: title });
  if (findName) {
    return res.status(400).json({
      status: "fail",
      message: "This name already exists!",
    });
  }
  const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
  const slider = result.url;
  let data1 = {
    image: slider,
    title: title,
    actualPrice: data?.actualPrice,
    discountPrice: data?.discountPrice,
    gst: data?.gst,
    startDate: data?.startDate,
    endDate: data?.endDate,
  };

  // console.log(data1);
  // const data = req.body;

  const newFlashDeals = await FlashDeals.create(data1);
  res.status(200).json({
    status: "success",
    message: "New Flash Deals created successfully!",
    data: newFlashDeals,
  });
};

export const updateFlashDeals = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const flashDeals = await FlashDeals.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    message: "Flash Deals updated successfully!",
    data: flashDeals,
  });
};
export const deleteFlashDeals = async (req, res) => {
  const { id } = req.params;
  const deleteFlash = await FlashDeals.findByIdAndDelete(id);
  if (!deleteFlash) {
    return res.status(404).json({
      status: "fail",
      message: "Flash Deals not found!",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Flash Deals deleted successfully!",
  });
};
export const getFlashDealsById = async (req, res) => {
  const { id } = req.params;
  const flashDeals = await FlashDeals.findById(id);
  if (!flashDeals) {
    return res.status(404).json({
      status: "fail",
      message: "Flash Deals not found!",
    });
  }
  res.status(200).json({ data: flashDeals, status: "success" });
};
export const getFlashDeals = async (req, res) => {
  try {
    const flashDeals = await FlashDeals.find().populate("productId");
    res.status(200).json({ data: flashDeals, status: "success" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const approveFlashDeals = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Get status from request body

    if (!["pending", "approved"].includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status! Status must be 'pending' or 'approved'.",
      });
    }

    // First, find the FlashDeal to ensure it exists
    const flashDeal = await FlashDeals.findById(id);
    if (!flashDeal) {
      return res.status(404).json({
        status: "fail",
        message: "Flash Deal not found!",
      });
    }

    // If setting to "approved", change all others to "pending"
    if (status === "approved") {
      await FlashDeals.updateMany(
        { _id: { $ne: id } }, // Exclude the current one
        { status: "pending" }
      );
    }

    // Update the selected FlashDeal
    const updatedFlashDeal = await FlashDeals.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: `Flash Deal status updated to '${status}' successfully!`,
      data: updatedFlashDeal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export const addProductToFlashDeals = async (req, res) => {
  try {
    const { id } = req.params; // Get FlashDeals ID from URL params
    const { productId } = req.body; // Get productId from the request body

    if (!productId) {
      return res.status(400).json({
        status: "fail",
        message: "Product ID is required!",
      });
    }

    // Find and update the FlashDeals document by adding the product ID
    const flashDeals = await FlashDeals.findByIdAndUpdate(
      id,
      { $push: { productId } },
      { new: true, runValidators: true }
    ).populate("productId"); // Optionally populate product details

    if (!flashDeals) {
      return res.status(404).json({
        status: "fail",
        message: "Flash Deals not found!",
      });
    }

    // Return the updated flash deals
    res.status(200).json({
      status: "success",
      message: "Product added to Flash Deals successfully!",
      data: flashDeals,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const removeProductFromFlashDeals = async (req, res) => {
  try {
    const { id } = req.params; // FlashDeals ID
    const { productId } = req.body; // Product ID to remove

    // Validate input
    if (!productId) {
      return res.status(400).json({
        status: "fail",
        message: "Product ID is required!",
      });
    }

    // Find and update the FlashDeals document by removing the product ID
    const flashDeals = await FlashDeals.findByIdAndUpdate(
      id,
      { $pull: { productId } },
      { new: true, runValidators: true }
    ).populate("productId"); // Optionally populate remaining product details

    if (!flashDeals) {
      return res.status(404).json({
        status: "fail",
        message: "Flash Deals not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product removed from Flash Deals successfully!",
      data: flashDeals,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getProductbyFlashDeal = async (req, res) => {
  try {
    const { id } = req.params;

    // Find flash deals by ID and populate the "productId" field
    const flashDeals = await FlashDeals.findById(id).populate("productId");

    if (!flashDeals) {
      return res.status(404).json({
        status: "fail",
        message: "Flash Deals not found!",
      });
    }

    // Respond with the populated flash deals
    res.status(200).json({
      data: flashDeals,
      status: "success",
    });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
