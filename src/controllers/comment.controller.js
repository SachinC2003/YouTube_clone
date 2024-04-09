import mongoose from "mongoose"
import comment, {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import comment from "../models/comment.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
  }

  const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 } // Sort comments by creation date in descending order
  };

  const comments = await Comment.paginate({ video: videoId }, options);

  res.json(new ApiResponse(200, "Video comments retrieved successfully", comments));
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { userId } = req.body

    if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }

    const comment = new comment({
       content : content,
       user : userId,
       video : videoId
    })

    await comment.save();

    res.json(new ApiResponse(200, "comment added successfully", comment))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid commentId");
    }

    const comment = await Comment.findByIdAndUpdate(commentId, {content}, {new: true});
    if (!comment) {
      throw new ApiError(404, "Comment not found");
  }
    res.json(new ApiResponse(200, "update comment successfuly"));
})

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid commentId");
  }

  // Find the comment by ID and delete it
  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
      throw new ApiError(404, "Comment not found");
  }

  res.json(new ApiResponse(200, "Comment deleted successfully"));
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }