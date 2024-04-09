import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const {userId} = req.user

    const tweet = new tweet({
       content : content,
       user : userId
    })

    await tweet.save();

    res.json(new ApiResponse(200, "Tweet save successfully", tweet))
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if(!mongoose.isValidObjectId(userId)){
      throw new ApiError(400, "Invalid userId");
    }

    const tweets = await Tweet.find({ user: userId })

    res.json(new ApiResponse(200, "User tweets retrieved successfully", tweets));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {userId} = req.body
    const {tweetId} = req.params

    if(!mongoose.isValidObjectId(userId)){
      throw new ApiError(400, "Invalid userId");
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
      throw new ApiError(404, "Tweet not found");
    } 

    tweet.content = content;
    await tweet.save();

    res.json(new ApiResponse(200, "Tweet updated successfully", tweet));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {userId} = req.body
    const {tweetId} = req.params
    
    if(!mongoose.isValidObjectId(userId)){
      throw new ApiError(400, "Invalid userId");
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);
    if(!tweet){
      throw new ApiError(404, "Tweet not found");
    } 

    res.json(new ApiResponse(200, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}