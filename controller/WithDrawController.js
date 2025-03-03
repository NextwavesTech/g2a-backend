import { WithDraw } from "../model/WithDraw.js";

export const createWithdraw = async (req, res) => {
  const { sellerId, amount } = req.body;
  const data = req.body;

  try {
    const newWithdraw = new WithDraw({
      sellerId,
      amount,
    });
    await newWithdraw.save();
    res.status(201).json({
      status: "success",
      message: "Withdraw request created successfully",
      data: newWithdraw,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Failed to create withdraw request",
      error,
    });
  }
};

export const getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await WithDraw.find().populate("sellerId");
    res.status(200).json({
      status: "success",
      data: withdraws,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch withdraw requests",
      error,
    });
  }
};
export const getSellerWithdraws = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const withdraws = await WithDraw.find({ sellerId }).populate("sellerId");
      res.status(200).json({
        status: "success",
        data: withdraws,
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "Failed to fetch withdraw requests",
        error,
      });
    }
};


export const updateWithdrawStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const withdraw = await WithDraw.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Withdraw status updated successfully",
      data: withdraw,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "Withdraw not found",
      error,
    });
  }
};
