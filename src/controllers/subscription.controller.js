import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const {userId } = req.user
    // TODO: toggle subscription

    if(!mongoose.isValidObjectId(channelId)){
      throw new ApiError(400, "Invalid channelId");
    }

    let subscription = await Subscription.findOne({channel : channelId}, {subscriber : userId})

    if(subscription){
       // subscription is present 
       await subscription.remove()
       res.json(new ApiError(200, "subscription remove successfully"))
    }
    else{
      subscription = await Subscription({channel: channelId}, {subscriber : userId})
      await subscription.save()
      res.json(new ApiError(200, "subscription save successfully"))
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid channelId");
  }

  // Find all subscriptions for the given channel
  const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "username");

  res.json(new ApiResponse(200, "Success", subscribers));
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!mongoose.isObjectIdOrHexString(subscriberId)){
        throw new ApiError(400, "Invalid channelId");
    }

    const subscriptions = await Subscription.find({subscriber: subscriberId}).populate("channel", "name")

    res.json(new ApiResponse(200,"Success", subscriptions))
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}