import { Platform } from "../model/Platform.js";

export const createPlatform = async (req, res, next) => {
  const { title } = req.body;
  const data = req.body;
  const findTitle = await Platform.findOne({ title: title });
  if (findTitle) {
    return res.status(400).json({
      status: "fail",
      message: "This name already exists!",
    });
  }

  const newPlatform = await Platform.create(data);
  res.status(200).json({
    status: "success",
    message: "New Platform created successfully!",
    data: newPlatform,
  });
};

export const getAllPlatforms = async (req, res, next) => {
  const platforms = await Platform.find();
  res.status(200).json({
    status: "success",
    data: platforms,
  });
};

export const getPlatformById = async (req, res, next) => {
  const platform = await Platform.findById(req.params.id);
  if (!platform) {
    return res.status(404).json({
      status: "fail",
      message: "Platform not found!",
    });
  }
  res.status(200).json({
    status: "success",
    data: platform,
  });
};

export const updatePlatformById = async (req, res, next) => {
  const platform = await Platform.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!platform) {
    return res.status(404).json({
      status: "fail",
      message: "Platform not found!",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Platform updated successfully!",
    data: platform,
  });
};

export const deletePlatformById = async (req, res, next) => {
  const platform = await Platform.findByIdAndDelete(req.params.id);
  if (!platform) {
    return res.status(404).json({
      status: "fail",
      message: "Platform not found!",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Platform deleted successfully!",
    data: null,
  });
};
