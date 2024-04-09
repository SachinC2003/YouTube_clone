import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    // Get total video views
    const totalVideoViews = await Video.aggregate([
        { $match: { channel: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, views: { $sum: "$views" } } }
    ]);

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Get total videos
    const totalVideos = await Video.countDocuments({ channel: channelId });

    // Get total likes on channel's videos
    const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ channel: channelId }, "_id") } });

    res.json(new ApiResponse(200, "Channel stats retrieved successfully", {
        totalVideoViews: totalVideoViews.length > 0 ? totalVideoViews[0].views : 0,
        totalSubscribers,
        totalVideos,
        totalLikes
    }));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    // Get all videos uploaded by the channel
    const videos = await Video.find({ channel: channelId });

    res.json(new ApiResponse(200, "Channel videos retrieved successfully", videos));
});

export {
    getChannelStats,
    getChannelVideos
};
