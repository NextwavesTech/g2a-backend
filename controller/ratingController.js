import { Rating } from "../model/rating.js";
import mongoose from "mongoose";

export const createRating = async (req, res) => {
  const rating = req.body;
  const newRating = new Rating(rating);
  try {
    await newRating.save();
    res
      .status(201)
      .json({
        data: newRating,
        message: "Rating created successfully",
        status: "success",
      });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find();
    res
      .status(200)
      .json({
        data: ratings,
        message: "Ratings fetched successfully",
        status: "success",
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getRating = async (req, res) => {
  const { id } = req.params;
  try {
    const rating = await Rating.findById(id);
    res
      .status(200)
      .json({
        data: rating,
        message: "Rating fetched successfully",
        status: "success",
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const updateRating = async (req, res) => {
  const { id } = req.params;
  const rating = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No rating with id: ${id}`);
  const updatedRating = await Rating.findByIdAndUpdate(id, rating, {
    new: true,
  });
  res
    .status(200)
    .json({
      data: updatedRating,
      message: "Rating updated successfully",
      status: "success",
    });
};
export const deleteRating = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No rating with id: ${id}`);
  await Rating.findByIdAndRemove(id);
  res
    .status(200)
    .json({ message: "Rating deleted successfully", status: "success" });
};
export const getRatingByProductId = async (req, res) => {
  const { id } = req.params;
  try {
    const ratings = await Rating.find({ product: id });
    res
      .status(200)
      .json({
        data: ratings,
        message: "Ratings fetched successfully",
        status: "success",
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getRatingByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const ratings = await Rating.find({ user: id });
    res
      .status(200)
      .json({
        data: ratings,
        message: "Ratings fetched successfully",
        status: "success",
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getOverallRating = async (req, res) => {
  const { id } = req.params;
  try {
    const ratings = await Rating.find({ product: id });
    let sum = 0;
    ratings.forEach((rating) => {
      sum += rating.rating;
    });
    const overallRating = sum / ratings.length;
    res
      .status(200)
      .json({
        data: overallRating,
        message: "Overall rating fetched successfully",
        status: "success",
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
