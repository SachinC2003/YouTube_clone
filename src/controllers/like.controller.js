import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
    const {videoId} = req.params
    const {userId} = req.body

    if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
  }

  const existLike = await Like.find(videoId)({video : videoId}, {user : userId});

  if(existLike){
    await existLike.remove();
    res.json(new ApiResponse(200, "Like remove"))
  }
  else{
    const like = new Like({ video: videoId, user: userId });
    await like.save();
    res.json(new ApiResponse(200, "Like added to video"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const {userId} = req.body

    if (!mongoose.isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid commentId");
  }

  const existLike = await Like.find(commentId)({comment : commentId}, {user : userId});

  if(existLike){
    await existLike.remove();
    res.json(new ApiResponse(200, "Like remove"))
  }
  else{
    const like = new Like({ comment: commentId, user: userId });
    await like.save();
    res.json(new ApiResponse(200, "Like added to comment"));
  }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user; // Assuming authenticated user

  if (!mongoose.isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweetId");
  }

  // Check if the user has already liked the tweet
  const existingLike = await Like.findOne({ tweet: tweetId, user: userId });

  if (existingLike) {
      // If like exists, remove it
      await existingLike.remove();
      res.json(new ApiResponse(200, "Like removed from tweet"));
  } else {
      // If like doesn't exist, add it
      const like = new Like({ tweet: tweetId, user: userId });
      await like.save();
      res.json(new ApiResponse(200, "Like added to tweet"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {userId} = req.body
    if (!mongoose.isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweetId");
    }

    const likedVideo = await Like.find({user: userId}, {video: { $exists: true }}).populate("video")

    res.json(new ApiResponse(200, "Liked videos retrieved successfully", likedVideos));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}