import { BundleDeals } from "../model/BundleDeals.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

export const createBundleDeals = async (req, res) => {
  const data = req.body;
  const title = data?.title;
  const findName = await BundleDeals.findOne({ title: title });
  if (findName) {
    return res.status(400).json({
      status: "fail",
      message: "This name already exists!",
    });
  }

  const newBundleDeals = await BundleDeals.create(data);
  res.status(200).json({
    status: "success",
    message: "New Bundle Deals created successfully!",
    data: newBundleDeals,
  });
};

export const updatenewBundleDeals = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const newBundleDeals = await BundleDeals.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    message: "Bundle Deals updated successfully!",
    data: newBundleDeals,
  });
};
export const deleteBundleDeals = async (req, res) => {
  const { id } = req.params;
  const deleteBundle = await BundleDeals.findByIdAndDelete(id);
  if (!deleteBundle) {
    return res.status(404).json({
      status: "fail",
      message: "Bundle Deals not found!",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Bundle Deals deleted successfully!",
  });
};
export const getbundleDealsById = async (req, res) => {
  const { id } = req.params;
  const bundleDeals = await BundleDeals.findById(id);
  if (!bundleDeals) {
    return res.status(404).json({
      status: "fail",
      message: "Bundle Deals not found!",
    });
  }
  res.status(200).json({ data: bundleDeals, status: "success" });
};
export const getBundleDeals = async (req, res) => {
  try {
    const bundleDeals = await BundleDeals.find().populate("productId");
    res.status(200).json({ data: bundleDeals, status: "success" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const approvebundleDeals = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Get status from request body

    if (!["pending", "approved"].includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status! Status must be 'pending' or 'approved'.",
      });
    }

    const bundleDeal = await BundleDeals.findById(id);
    if (!bundleDeal) {
      return res.status(404).json({
        status: "fail",
        message: "Bundle Deal not found!",
      });
    }

    const updatedBundleDeals = await BundleDeals.findByIdAndUpdate(
      id,
      { status:status },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: `Bundle Deals status updated to '${status}' successfully!`,
      data: updatedBundleDeals,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const addProductTobundleDeals = async (req, res) => {
    try {
      const { id } = req.params;
      const { productId } = req.body;
  
      if (!productId) {
        return res.status(400).json({
          status: "fail",
          message: "Product ID is required!",
        });
      }
  
      const bundleDeals = await BundleDeals.findById(id).populate("productId");
  
      if (!bundleDeals) {
        return res.status(404).json({
          status: "fail",
          message: "Bundle Deal not found!",
        });
      }
  
      // Check if the bundle already contains 2 products
      if (bundleDeals.productId.length >= 2) {
        return res.status(400).json({
          status: "fail",
          message: "A bundle deal can have a maximum of 2 products only!",
        });
      }
  
      // Add the new product
      bundleDeals.productId.push(productId);
      await bundleDeals.save();
  
      res.status(200).json({
        status: "success",
        message: "Product added to Bundle Deals successfully!",
        data: bundleDeals,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
  

export const removeProductFrombundleDeals = async (req, res) => {
  try {
    const { id } = req.params; 
    const { productId } = req.body; // Product ID to remove

    // Validate input
    if (!productId) {
      return res.status(400).json({
        status: "fail",
        message: "Product ID is required!",
      });
    }

    const newBundleDeals = await BundleDeals.findByIdAndUpdate(
      id,
      { $pull: { productId } },
      { new: true, runValidators: true }
    ).populate("productId"); // Optionally populate remaining product details

    if (!newBundleDeals) {
      return res.status(404).json({
        status: "fail",
        message: "Bundle Deals not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product removed from Bundle Deals successfully!",
      data: newBundleDeals,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getProductbybundleDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const bundleDeals = await BundleDeals.findById(id).populate("productId");

    if (!bundleDeals) {
      return res.status(404).json({
        status: "fail",
        message: "Bundle Deals not found!",
      });
    }

    res.status(200).json({
      data: bundleDeals,
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
