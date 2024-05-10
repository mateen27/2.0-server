import { Request, Response } from "express";
import User, { UserInterface } from "../models/userModel";
import {
  acceptFriendRequest,
  createNotification,
  createNotificationn,
  deleteMessages,
  fetchChatsService,
  fetchFollowers,
  fetchFollowing,
  fetchFriendRequests,
  fetchPosts,
  fetchUserFollowersHandler,
  fetchUserFollowingHandler,
  fetchUserPosts,
  findPostById,
  findUserByEmailAndPassword,
  findUserByID,
  generateToken,
  getUserDetailsService,
  isAlreadyRegistered,
  listAllUsersExceptLoggedIn,
  registerToDatabase,
  sendMessageToRecipient,
  updateFriendRequests,
  updateSentFriendRequests,
  updateUserUploadedPosts,
} from "../services/authService";
import mongoose, { FilterQuery } from "mongoose";
import Post, { PostInterface } from "../models/postModel";
// movies data
import * as fs from "fs";
// ----------------------------------- --------------------------------
// Movies data from the data folder
import path from "path";

const ALL_MOVIES = path.resolve(__dirname, "../data/AllMovies.json");

const BollywoodMovies = path.resolve(__dirname, "../data/BollywoodMovies.json");

const NowPlayingMovies = path.resolve(
  __dirname,
  "../data/NowPlayingMovies.json"
);

const PopularMovies = path.resolve(__dirname, "../data/PopularMovies.json");

const TamilMovies = path.resolve(__dirname, "../data/TamilMovies.json");

const TelguMovies = path.resolve(__dirname, "../data/TelguMovies.json");

const TopRatedMovies = path.resolve(__dirname, "../data/TopRatedMovies.json");

const UpcomingMovies = path.resolve(__dirname, "../data/UpcomingMovies.json");

// ----------------------------------- --------------------------------

import RoomModel, { Movie, MovieModel, Room } from "../models/roomModel";
// importing uuid for random ID generation
import { v4 as uuidv4 } from "uuid";
import Notification, {
  NotificationInterface,
} from "../models/notificationModel";

import MovieCastDetails from "../data/MovieCast/MovieCastDetails.json";
import MovieDetails from "../data/MovieDetails/MovieDetails.json";

// logic for signing the user inside of the application
const loginUserHandler = async (req: Request, res: Response) => {
  try {
    // accessing the input values which user provided in the front-end
    const { email, password } = req.body;

    // check if the email and password are provided or not!
    if (
      email === undefined ||
      password === undefined ||
      !email ||
      !password ||
      email === "" ||
      password === ""
    ) {
      return res.status(400).json({
        status: 400,
        message: "Please provide email and password",
      });
    }

    // checking if the user is authenticated in database or not!
    const user = await findUserByEmailAndPassword(email, password);

    // is user is not found in the database
    if (user === null || user === undefined) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // when the user is found inside the database
    if (user) {
      // user is found
      // generating the token for the user
      const token = await generateToken(user._id);

      if (token) {
        // token is generated
        return res.status(200).json({
          user,
          token,
        });
      } else {
        // token is not generated
        return res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    } else {
      // user not found or invalid credentials
      return res.status(404).json({
        status: 404,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error during login!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for registering the user inside of the application
const registerUserHandler = async (req: Request, res: Response) => {
  try {
    // try accessing the details of the user
    const { email } = req.body;

    // Calling a function in the service to handle database operations!
    const user = await isAlreadyRegistered(email);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error Registering the user!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for sending the user has been verified into the database
// Endpoint for handling verified user
const verifiedUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for fetching all the users of the application except the logged in user & sent friendRequest and in friendRequest person
const fetchAllUsersHandler = async (req: Request, res: Response) => {
  try {
    // accessing the logged in user's profile
    const loggedInUser = req.params.userID;

    // Making the query in the database where _id does not include the loggedInUserId
    const users = await listAllUsersExceptLoggedIn(loggedInUser);

    res.status(200).json({ users });
  } catch (error) {
    console.log("Error fetching the users:", error);
    res.status(500).json({ message: "Error fetching all the users!" });
  }
};

// logic for sending friend requests to the person!
const sendFriendRequestHandler = async (req: Request, res: Response) => {
  try {
    // recepient user ID
    const { selectedUserId } = req.body;
    // current user ID
    const { userID } = req.params;

    // update the sender's sentFriendRequest [add recipientId to their friend requests sent list]
    const senderResponse: any = await updateSentFriendRequests(
      userID,
      selectedUserId
    );

    // update the recipient's sentFriendRequest [add senderId to their friend requests sent list]
    const recipientResponse: any = await updateFriendRequests(
      selectedUserId,
      userID
    );

    // return the response
    res.status(200).json({ senderResponse, recipientResponse });
  } catch (error) {
    console.log("error sending friend request");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for viewing all the friend requests of the current user
const viewFriendRequestHandler = async (req: Request, res: Response) => {
  try {
    // accessing the logged in user's profile ID
    const { userID } = req.params;

    const users = await fetchFriendRequests(userID);
    res.status(200).json({ users });
  } catch (error) {
    console.log("error fetching the friend requests of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for accepting the friend-request of the user
const acceptFriendRequestHandler = async (req: Request, res: Response) => {
  try {
    // accesing the userID and the recipient ID of the user
    const { userID } = req.params;
    const { recepientID } = req.body;

    // redirecting to the services file
    await acceptFriendRequest(userID, recepientID);

    const existingUser = await User.findById(userID);
    if (existingUser) {
      await createNotificationn(
        recepientID,
        `Your friend request has been accepted by ${existingUser.name}.`,
        "friend_request_accepted",
        "" // Empty string as placeholder for postId
      );
    }

    // send the reponse back to the client
    res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    console.log("error accepting the friend request of the user", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// logic for displaying all the followers of the logged in user
const viewFollowersHandler = async (req: Request, res: Response) => {
  try {
    // accesing userID from the params
    const { userID } = req.params;

    // finding if the user the user exists or not
    const user = await fetchFollowers(userID);

    const followers = user?.followers;

    res.status(200).json(followers);
  } catch (error) {
    console.log("error fetching the followers of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for displaying all the followings of the user
const viewFollowingsHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID
    const { userID } = req.params;

    // finding if the user the user exists or not
    const user = await User.findById(userID).populate('following', 'name email image')

    // accesianing the following of the user
    const following = user?.following;
    // console.log('following', following);
    
    // console.log('user following', user);
    

    // returning the response
    res.status(200).json(following);
  } catch (error) {
    console.log("error fetching the followers of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for displaying the followers of the specific user
const fetchFollowersHandler = async (req: Request, res: Response) => {
  try {
    const { userID } = req.body;

    // finding if the user exists or not
    const user = await fetchUserFollowersHandler(userID);

    const followers = user?.followers;

    res.status(200).json(followers);
  } catch (error) {
    console.log("error fetching the followers of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for displaying the following of the user of the specified user
const fetchFollowingHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID from the body
    const { userID } = req.body;

    // finding if the user exists or not
    const user = await fetchUserFollowingHandler(userID);

    // accessing the following of the user
    const following = user?.following;

    res.status(200).json(following);
  } catch (error) {
    console.log("error fetching the following of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for uploading the post to the server
const uploadPostHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID from the params
    const { userID } = req.params;
    const { type, contentUrl, contentDescription } = req.body;

    // checking if the user exists or not
    const existingUser = await User.findById(userID);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // creating the post for the user
    const newPost: PostInterface = new Post({
      type,
      contentUrl,
      contentDescription,
      userID,
      likes: [],
      comments: [],
    });

    // save the post to the database
    const savedPost = await newPost.save();

    // update the user's uploadedPosts array with the new post's ID
    await updateUserUploadedPosts(userID, savedPost);

    res
      .status(201)
      .json({ message: "Post uploaded successfully", post: savedPost });
  } catch (error) {
    console.log("error uploading the post", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for deleting the post uploaded by the user
const deletePostHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID from params and postID from the body
    const { userID } = req.params;
    const { postID } = req.body;

    // checking if the user exists or not
    const existingUser = await findUserByID(userID);
    // user not found
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // checking if the post exists or not
    const post = await findPostById(postID);

    // post not found
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.userID.equals(userID)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // Delete the post
    await Post.deleteOne({ _id: postID });

    // Remove the post from the user's uploadedPosts array
    await User.findByIdAndUpdate(userID, { $pull: { uploadedPosts: postID } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("error deleting the post uploaded by the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for udating the description of the user post which he have uploaded
const updatePostDescriptionHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID from the params and accessing the post ID and description from the body
    const { userID } = req.params;
    const { postID, description } = req.body;
    const userIDObj = new mongoose.Types.ObjectId(userID);

    // checking if the post exists or not
    const post = await findPostById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //  console.log('post log', post.userID);
    //  console.log('userID Object ', userIDObj);
    //  console.log('is equal or not', post.userID.equals(userIDObj));

    // Verify that the user is authorized to modify the post
    if (!post.userID.equals(userIDObj)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this post" });
    }

    // Update the description of the post
    post.contentDescription = description;
    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post description updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log("error updating the description of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for displaying the posts on to the feed of the application
const postHandler = async (req: Request, res: Response) => {
  try {
    // fetching the posts fro the feed
    const posts = await fetchPosts();

    return res
      .status(200)
      .json({ message: "Posts fetched successfully", post: posts });
  } catch (error) {
    console.log(
      "error fetching the posts on to the feed of the application",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for fetching the posts of the logged in user
const userPostHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID from the parameters
    const { userID } = req.params;

    // checking if the user is authenticated
    const user = await findUserByID(userID);
    // user does not exist
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    // fetching the user's posts from the database
    const posts = await fetchUserPosts(userID);

    return res
      .status(200)
      .json({ message: "Posts successfully fetched", post: posts });
  } catch (error) {
    console.log("error fetching the posts of the logged in user", error);
    res
      .status(500)
      .json({ message: "Error fetching the posts of the logged in user" });
  }
};

// endpoint for fetching the posts of the specific user
const fetchPostsHandler = async (req: Request, res: Response) => {
  try {
    // accesing the posts of the user only when the user is following the user
    const { userID } = req.params;
    const { recipientID } = req.body;

    // Checking if the current user is following the recipient
    const currentUser = await User.findById(userID);
    const isFollowing = currentUser?.following.includes(recipientID);

    // when the user is not following the user
    if (!isFollowing) {
      return res
        .status(403)
        .json({ message: `You are not authorized to view this user\'s posts` });
    }

    // fetch the users posts
    const post = await Post.find({ userID: recipientID }).populate(
      "userID",
      "name email"
    );

    res.status(200).json({ post });
  } catch (error) {
    console.log("error fetching posts of the specific user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for liking the post of the user and notifying the user
const likePostsHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID from the parameters
    const { userID } = req.params;
    // accessing the postID from the body
    const { postID } = req.body;

    const userIDObj = new mongoose.Types.ObjectId(userID);
    const postIdObj = new mongoose.Types.ObjectId(postID);

    // checking if the user exists or not
    const existingUser = await User.findById(userIDObj);
    // user not found
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // checking if the post exists or not
    const post = await Post.findById(postIdObj);
    // post not found
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // checking if the user has already liked the post
    if (post.likes.includes(userIDObj)) {
      post.likes = post.likes.filter((like) => !like.equals(userIDObj));
      await post.save();
      await createNotification(
        post.userID.toString(),
        `${existingUser.name} unliked your post.`,
        "unlike",
        postID
      );
      return res.status(400).json({ message: "Post unliked successfully" });
    }

    // if the user has not liked the post yet
    post.likes.push(userIDObj);
    await post.save();
    // send like notification
    await createNotification(
      post.userID.toString(),
      `${existingUser.name} liked your post.`,
      "like",
      postID
    );

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.log("Error liking post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for commenting on the post of the user
const commentPostHandler = async (req: Request, res: Response) => {
  try {
    // accesing the params and body
    const { userID } = req.params;
    const { postID, comment } = req.body;

    // converting the iDS to Object ID
    const userIDObj = new mongoose.Types.ObjectId(userID);
    const postIdObj = new mongoose.Types.ObjectId(postID);

    // checking if the user exists or not
    const existingUser = await User.findById(userIDObj);
    // user not found
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // checking if the post exists or not
    const post = await Post.findById(postIdObj);
    // post not found
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // add comments to the post if the post already exists
    post.comments.push({ userID: userIDObj, text: comment });
    await post.save();

    // Notify the user who have commented to the post
    // checking which user posted the post
    const postByUser = await User.findById(post.userID);
    if (postByUser) {
      await createNotification(
        post.userID.toString(),
        `${existingUser.name} commented on your post.`,
        "comment",
        postID
      );
    }

    res.status(200).json({ message: "Comment posted successfully" });
  } catch (error) {
    console.log("error commenting on post", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for deleteing the post comments
const deleteCommentPostHandler = async (req: Request, res: Response) => {
  try {
    const { userID, postID, commentID } = req.body;

    const userIDObj = new mongoose.Types.ObjectId(userID);
    const postIDObj = new mongoose.Types.ObjectId(postID);
    const commentIDObj = new mongoose.Types.ObjectId(commentID);

    // Check if the user is authorized to delete the post
    const post = await Post.findOne({ _id: postIDObj, userID: userIDObj });

    console.log("post log", post);

    // if (!post) {
    //     return res.status(403).json({ message: 'You are not authorized to delete this post' });
    // }

    // // Delete the comment from the post
    // const updatedPost = await Post.findOneAndUpdate(
    //     { _id: postIDObj, 'comments._id': commentIDObj },
    //     { $pull: { comments: { _id: commentIDObj } } },
    //     { new: true }
    // );

    // if (!updatedPost) {
    //     return res.status(404).json({ message: 'Comment not found' });
    // }

    // res.status(200).json({ message: 'Comment deleted successfully', post: updatedPost });
  } catch (error) {
    console.log("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for sending movies responses
const getAllMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(ALL_MOVIES, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getBollywoodMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(BollywoodMovies, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPopularMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(PopularMovies, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNowPlayingMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(NowPlayingMovies, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTamilMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(TamilMovies, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTelguMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(TelguMovies, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTopRatedMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(TopRatedMovies, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUpcomingMoviesHandler = async (req: Request, res: Response) => {
  try {
    // read the JSON data from the file
    fs.readFile(UpcomingMovies, "utf8", (err, data) => {
      if (err) {
        console.log("error reading the file", err);
        res.status(500).json({ message: "Internal Server Error" });
      }

      // parse the json data
      const parseData = JSON.parse(data);
      // console.log(data);

      // send the data to the client
      res.status(200).json(parseData);
    });
  } catch (error) {
    console.log("error fetching the movies", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to fetch user by ID and populate email and name
const fetchUserByID = async (req: Request, res: Response) => {
  try {
    // Get the user ID from request parameters
    const { userID } = req.params;

    // Find the user by ID and populate the email and name fields
    const user = await User.findById(userID).select("email name image").exec();

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user exists, return the user data
    res.status(200).json({ user });
  } catch (error) {
    // Handle errors
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint for creating a room
const createRoomHandler = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { movieID, movieName, movieLink } = req.body; // Destructure movie details from request body

    // Find all active rooms created by the user
    const activeRooms = await RoomModel.find({
      hostUserId: userID,
      status: "active",
    });

    // Set status of all active rooms except the current one to 'ended'
    await Promise.all(
      activeRooms.map(async (room) => {
        if (room.roomID !== req.body.roomID) {
          room.status = "ended";
          await room.save();
        }
      })
    );

    // convert the string userID to mongoose ObjectID
    const userId = new mongoose.Types.ObjectId(userID);

    // Create new room
    const roomId = uuidv4(); // Generate a random unique roomId
    const movieDetails: Movie = new MovieModel({
      movieID,
      movieName,
      movieLink,
    });
    const roomData = {
      roomID: roomId,
      hostUserId: userId,
      movieDetails: [movieDetails], // Assuming movieDetails is a single Movie object
      status: "active", // Default status
      createdAt: new Date(),
      usersJoined: [], // Initialize users joined array
      users: [], // Initialize users array
    };

    const room = await RoomModel.create(roomData);
    res.status(201).json({ room, roomId }); // Send roomId in the response
  } catch (error) {
    console.log("Error creating room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for joining the room
const joinRoomHandler = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { roomID } = req.body;

    // Find the room by ID
    const room = await RoomModel.findOne({ roomID });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Convert the string userID to mongoose.Types.ObjectId
    const userId = new mongoose.Types.ObjectId(userID);
    // Check if the user is already in the room
    const userInRoom = room.users.some((user) => user.equals(userId));
    // if (userInRoom) {
    //   return res.status(400).json({ error: 'User already in the room' });
    // }

    // Add the user to the room
    room.users.push(userId);
    room.usersJoined.push({ userId, joinedAt: new Date() });
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    console.log("error joining the room", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endopoint for searching the user
const searchUserHandler = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;

    // Ensure that keyword is a string
    if (typeof keyword !== "string") {
      throw new Error("Keyword must be a string");
    }

    // Search users whose name contains the keyword (case-insensitive)
    const users = await User.find({
      name: { $regex: new RegExp(keyword, "i") },
    } as FilterQuery<UserInterface>);

    // Return the search results
    res.json({ success: true, users: users });
  } catch (error) {
    console.log("error searching the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for fetching the room information
const fetchRoomDetailsHandler = async (req: Request, res: Response) => {
  try {
    // Extract the roomId from the request parameters
    const { roomID } = req.params;

    // Find the room in the database by roomId
    const room: Room | null = await RoomModel.findOne({ roomID })
      .populate("hostUserId", "id name email") // Populate the hostUserId field to get the host details
      .populate("users", "id name") // Populate the users field to get the user IDs
      .populate("movieDetails")
      .lean();

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Get the number of users in the room
    const numberOfUsers: number = room.users.length;

    // Extract relevant information from the room
    const roomDetails = {
      roomID: room.roomID,
      host: room.users,
      numberOfUsers: numberOfUsers,
      userIds: room.hostUserId, // Include the user IDs
      movieDetails: room.movieDetails,
    };

    // Send the room details as a response
    res.status(200).json(roomDetails);
  } catch (error) {
    console.log("error fetching the room information", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for fetching the Notifications of the Users
const fetchNotificationHandler = async (req: Request, res: Response) => {
  try {
    // Extract the user ID from the request parameters
    const { userID } = req.params;

    // Use Mongoose to find notifications by user ID
    const notifications: NotificationInterface[] = await Notification.find({
      userId: userID,
    });

    // Return the fetched notifications as a response
    res.status(200).json({ notifications });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// endpoint for fethcing the movie cast details
const fetchMovieCastHandler = (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId);

    // Find the movie cast details based on the movie ID
    const castDetails = MovieCastDetails.find(
      (movie: any) => movie.id === movieId
    );

    if (castDetails) {
      res.status(200).json(castDetails);
    } else {
      res.status(404).json({ message: "Movie cast details not found" });
    }
  } catch (error) {
    console.log("error fetching the cast details", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint for fetching the movie details
const fetchMovieDescriptionHandler = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId);

    // Find the movie cast details based on the movie ID
    const castDetails = MovieDetails.find((movie: any) => movie.id === movieId);

    if (castDetails) {
      res.status(200).json(castDetails);
    } else {
      res.status(404).json({ message: "Movie cast details not found" });
    }
  } catch (error) {
    console.log("error finding the movies details ", error);
    res.status(500).json({ message: "Movie cast details not found" });
  }
};

// endpoint for searching the movies
const getSearchMovieHandler = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.params.title.toLowerCase(); // Assuming the movie title is passed in the request body as 'title'

    // Read the JSON file synchronously and parse it into an object
    // Construct the file path using path.join()
    const filePath = path.resolve(__dirname, "../data/AllMovies.json");
    // console.log('filePaths', filePath);

    // Read the JSON file synchronously and parse it into an object
    const moviesData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // console.log('moviesData', moviesData);

    const results = moviesData.results.filter(
      (movie: any) => movie.title.toLowerCase() === searchQuery
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(results);
  } catch (error) {
    console.log("error finding the movie", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to send message to a person
const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId, messageType, messageText, imageUrl } =
      req.body;

    console.log("userID", senderId);
    console.log("recepientId", recipientId);

    // Assuming you have defined the sendMessage function elsewhere
    await sendMessageToRecipient(senderId, recipientId, messageType, messageText, imageUrl);

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// function to fetch the userDetails of a person!
const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // fetch the user Data from the userId
    const response = await getUserDetailsService(userId);

    if (response) {
      res.json(response);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// // endpoint to fetch the messages between two users in the chatRoom!
const fetchChats = async (req: Request, res: Response) => {
  try {
    const { senderId, recepientId } = req.params;

    const message = await fetchChatsService(senderId, recepientId);

    res.json(message);
  } catch (error) {
    console.error("Error fetching Chats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// endpint to delete the messages between two users in the chatRoom
const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No messages to delete!" });
    }

    const message = await deleteMessages(messages);

    if (message) {
      res.json({ message: "Message deleted successfully!" });
    }
  } catch (error) {
    console.error("Error Deleting Messages:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export {
  loginUserHandler,
  registerUserHandler,
  verifiedUser,
  fetchAllUsersHandler,
  sendFriendRequestHandler,
  viewFriendRequestHandler,
  acceptFriendRequestHandler,
  viewFollowersHandler,
  viewFollowingsHandler,
  fetchFollowersHandler,
  fetchFollowingHandler,
  uploadPostHandler,
  deletePostHandler,
  updatePostDescriptionHandler,
  postHandler,
  userPostHandler,
  fetchPostsHandler,
  likePostsHandler,
  commentPostHandler,
  deleteCommentPostHandler,
  getAllMoviesHandler,
  getBollywoodMoviesHandler,
  getPopularMoviesHandler,
  getNowPlayingMoviesHandler,
  getTamilMoviesHandler,
  getTelguMoviesHandler,
  getTopRatedMoviesHandler,
  getUpcomingMoviesHandler,
  fetchUserByID,
  createRoomHandler,
  joinRoomHandler,
  searchUserHandler,
  fetchRoomDetailsHandler,
  fetchNotificationHandler,
  fetchMovieCastHandler,
  fetchMovieDescriptionHandler,
  getSearchMovieHandler,
  sendMessage,
  getUserDetails,
  fetchChats,
  deleteMessage
};
