import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { HomeSliders } from "../model/HomeSliders.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
    cloud_name: "ddu4sybue",
    api_key: "658491673268817",
    api_secret: "w35Ei6uCvbOcaN4moWBKL3BmW4Q",
});


// create slider
export const createSlider = catchAsyncError(async (req, res, next) => {
    let image = req.files.slider;
    const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
    const slider = result.url;
    let data = {
       slider: slider
    };
    // console.log(data);
    const newSlider = await HomeSliders.create(data);
    res.status(200).json({
        status: "success",
        message: "New slider created successfully!",
        data: newSlider,
    });

});



// get slider by id
export const getSliderById = async (req, res, next) => {
    const id = req?.params.id;
    try {
        const data = await HomeSliders.findById(id);

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




// Get All sliders
export const getAllsliders = catchAsyncError(async (req, res, next) => {
    try {
        const users = await HomeSliders.find();
        res.status(200).json({
            status: "success",
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: "fail",
            error: "Internal Server Error",
        });
    }
});
// delete sliders
export const deleteSliderById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const delSlider = await HomeSliders.findByIdAndDelete(id);
        if (!delSlider) {
            return res.json({ status: "fail", message: "Slider not Found" });
        }
        res.json({
            status: "success",
            message: "Slider deleted successfully!",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// upload image
export const uploadImage = async (req, res, next) => {
    let images = [];
    if (req.files && req.files.avatars) {
        if (!Array.isArray(req.files.avatars)) {
            images.push(req.files.avatars);
        } else {
            images = req.files.avatars;
        }
    }
    let responce = [];
    for (const image of images) {
        try {
            const result = await cloudinary.v2.uploader.upload(image.tempFilePath);
            const publidId = result.public_id;
            const url = result.url;
            let data = {
                publidId,
                url,
            };
            //  console.log(data);
            responce.push(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Error uploading images" });
        }
    }
    // console.log("-->1",responce);
    //     res.json{responce , result}
    res.send(responce);
};


