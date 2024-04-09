import mongoose, {isValidObjectId} from "mongoose"
import playlist, {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body
    const {userId} = req.user

    const playlist = new playlist({
       name, 
       description,
       user : userId
    })
     
    await playlist.save();

    res.json(new ApiResponse(201, "Playlist created successfully", playlist));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid userId");
  }

  const playlist = await Playlist.find({user: userId});

  res.json(new ApiResponse(200, "get the playlist Successefully", playlist));
})

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlistId");
  }

  // Find the playlist by ID
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
      throw new ApiError(404, "Playlist not found");
  }

  res.json(new ApiResponse(200, "Playlist retrieved successfully", playlist));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!mongoose.isValidObjectId(playlistId)){
      throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, { $addToSet: { videos: videoId } }, { new: true });

    if(!playlist){
      throw new ApiError(400, "playlist not exist")
    }

    res.json(new ApiResponse(200, "Video added to playlist successfully"))
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!mongoose.isValidObjectId(playlistId)){
      throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, { $pull: { videos: videoId } }, { new: true });

    if(!playlist){
      throw new ApiError(404, "playlist not found")
    }

    res.json(new ApiResponse(200, "Video removed from playlist successfully", playlist));

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!mongoose.isValidObjectId(playlistId)){
      throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
      throw new ApiError(404, "Playlist not found");
    }
    
    res.json(new ApiResponse(200, "playlist remove successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!mongoose.isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlistId");
  }

  // Find the playlist by ID and update its name and description
  const playlist = await Playlist.findByIdAndUpdate(playlistId, { name, description }, { new: true });

  if (!playlist) {
      throw new ApiError(404, "Playlist not found");
  }

  res.json(new ApiResponse(200, "Playlist updated successfully", playlist));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}