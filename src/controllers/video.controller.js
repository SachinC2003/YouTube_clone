import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    let filter = {};

    // If there's a userId, filter by that user
    if (userId) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        filter = { user: userId };
    }

    // Construct the sort options
    let sortOptions = {};
    if (sortBy && sortType) {
        sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
    }

    // Query and paginate videos
    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit);

    res.json(new ApiResponse(200, "Success", videos));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, videoUrl } = req.body;

    // Upload video to cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(videoUrl);

    // Create video document
    const video = new Video({
        title,
        description,
        videoUrl: cloudinaryResponse.secure_url,
        thumbnailUrl: cloudinaryResponse.secure_url, // Assuming cloudinary returns a thumbnail URL
        user: req.user._id // Assuming authenticated user
    });

    // Save video
    await video.save();

    res.json(new ApiResponse(201, "Video published successfully", video));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.json(new ApiResponse(200, "Success", video));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnailUrl } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Update video details
    if (title) video.title = title;
    if (description) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;

    // Save updated video
    await video.save();

    res.json(new ApiResponse(200, "Video updated successfully", video));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Delete video
    await video.remove();

    res.json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Toggle publish status
    video.published = !video.published;

    // Save updated video
    await video.save();

    res.json(new ApiResponse(200, "Publish status toggled successfully", video));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
