import { Region } from "../model/region.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: "ddu4sybue",
  api_key: "658491673268817",
  api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});

export const createRegion = async (req, res) => {
  const data = req.body;
  const title = data?.title;
  const findTitle = await Region.findOne({ title: title });
  if (findTitle) {
    return res.status(400).json({
      status: "fail",
      message: "This name already exists!",
    });
  }

  const newRegion = await Region.create(data);
  res.status(200).json({
    status: "success",
    message: "New Region created successfully!",
    data: newRegion,
  });
};

export const updateRegion = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const newRegion = await Region.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    message: "Region updated successfully!",
    data: newRegion,
  });
};
export const deleteRegion = async (req, res) => {
  const { id } = req.params;
  const deleteRegion = await Region.findByIdAndDelete(id);
  if (!deleteRegion) {
    return res.status(404).json({
      status: "fail",
      message: "Region not found!",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Region deleted successfully!",
  });
};

export const getAllRegion = async (req, res) => {
  const regions = await Region.find();
  res.status(200).json({
    status: "success",
    message: "All Regions fetched successfully!",
    data: regions,
  });
};

export const getRegionById = async (req, res) => {
  const { id } = req.params;
  const region = await Region.findById(id);
  if (!region) {
    return res.status(404).json({
      status: "fail",
      message: "Region not found!",
    });
  }
  res.status(200).json({ data: region, status: "success" });
};

