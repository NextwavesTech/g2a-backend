// import { catchAsyncError } from "../middleware/catchAsyncError.js";
// import { Wishlist } from "../model/wishlist.js";

// export const AddWishlist = catchAsyncError(async (req, res, next) => {
//   try {
//     const { userId, productId } = req.body;

//     // Check if the product is already in the wishlist
//     const existingItem = await Wishlist.findOne({ userId, productId });
//     if (existingItem) {
//       return res.status(400).json({ message: "Product already in wishlist" });
//     }

//     const wishlistItem = new Wishlist({ userId, productId });
//     const savedItem = await wishlistItem.save();
//     res.status(201).json(savedItem);
//   } catch (error) {
//     res.status(500).json({ error: "Error adding product to wishlist" });
//   }
// });

// export const getById = async (req, res, next) => {
//   try {
//     const wishlist = await Wishlist.find({
//       userId: req.params.id,
//     }).populate("productId");
//     res.json(wishlist);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching wishlist" });
//   }
// };

// export const deleteById = async (req, res, next) => {
//   try {
//     const { userId, productId } = req.body;
//     if(!userId || !productId) {
//       return res.status(400).json({ message: "User ID and Product ID are required" });
//     }
//     const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });
//     if (!deletedItem) {
//       return res.status(404).json({ message: "Product not found in wishlist" });
//     }
//     res.json({ message: "Product removed from wishlist" });
//   } catch (error) {
//     res.status(500).json({ error: "Error removing product from wishlist" });
//   }
// };

// export const getAll = async (req, res, next) => { 
//   try {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = 6;
//     const skip = (page - 1) * limit;
//     let wishlist = await Wishlist.find()
//       .populate("productId")
//       .skip(skip)
//       .limit(limit);

//     wishlist = wishlist.filter(item => item.productId !== null);

//     const totalItems = await Wishlist.countDocuments({ productId: { $ne: null } });

//     res.json({
//       status: "success",
//       data: wishlist,
//       pagination: {
//         totalItems,
//         currentPage: page,
//         limit,
//         totalPages: Math.ceil(totalItems / limit),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching wishlist" });
//   }
// };

import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Products } from "../model/Product.js";

// Add product to wishlist (likes array in Products model)
export const AddWishlist = catchAsyncError(async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.likes.includes(userId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    product.likes.push(userId);
    await product.save();
    
    res.status(200).json({ message: "Product added to wishlist", product });
  } catch (error) {
    res.status(500).json({ error: "Error adding product to wishlist" });
  }
});

// Remove product from wishlist
export const deleteById = catchAsyncError(async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.likes = product.likes.filter(id => id !== userId);
    await product.save();
    
    res.json({ message: "Product removed from wishlist", product });
  } catch (error) {
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
});

// Get wishlist by user ID
export const getById = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const products = await Products.find({ likes: userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

// Get all wishlists with pagination
export const getAll = catchAsyncError(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    
    const products = await Products.find({ likes: { $exists: true, $not: { $size: 0 } } })
      .skip(skip)
      .limit(limit);
    
    const totalItems = await Products.countDocuments({ likes: { $exists: true, $not: { $size: 0 } } });
    
    res.json({
      status: "success",
      data: products,
      pagination: {
        totalItems,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});





