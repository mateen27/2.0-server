import express, { Request, Response } from "express";
import {
  acceptFriendRequestHandler,
  commentPostHandler,
  createRoomHandler,
  deleteCommentPostHandler,
  deleteMessage,
  deletePostHandler,
  fetchAllUsersHandler,
  fetchChats,
  fetchFollowersHandler,
  fetchFollowingHandler,
  fetchMovieCastHandler,
  fetchMovieDescriptionHandler,
  fetchNotificationHandler,
  fetchPostsHandler,
  fetchRoomDetailsHandler,
  fetchUserByID,
  getAllMoviesHandler,
  getBollywoodMoviesHandler,
  getNowPlayingMoviesHandler,
  getPopularMoviesHandler,
  getSearchMovieHandler,
  getTamilMoviesHandler,
  getTelguMoviesHandler,
  getTopRatedMoviesHandler,
  getUpcomingMoviesHandler,
  getUserDetails,
  joinRoomHandler,
  likePostsHandler,
  loginUserHandler,
  postHandler,
  registerUserHandler,
  searchUserHandler,
  sendFriendRequestHandler,
  sendMessage,
  updatePostDescriptionHandler,
  uploadPostHandler,
  userPostHandler,
  verifiedUser,
  viewFollowersHandler,
  viewFollowingsHandler,
  viewFriendRequestHandler,
} from "../controllers/controllers";
import sendAndSaveOTP from "../middlewares/sendAndSaveOTP";
import verifyOTP from "../middlewares/verifyOTP";

const router = express.Router();

// Endpoint for logging in the user in the application
router.post("/login", loginUserHandler); // working API
// Endpoint for registering tge user inside of the application
router.post("/register", sendAndSaveOTP, registerUserHandler); // working API
// endpoint for verifing the otp of the user in the application
router.post(`/verify/:userID`, verifyOTP, verifiedUser); // working API
// endpoint for fetching all the users in the application except the logged in user
router.get("/fetchAllUsers/:userID", fetchAllUsersHandler); // working API
// endpoint for sending friend-requests to the person
router.post("/friendRequests/:userID", sendFriendRequestHandler); // working API
// endpoint for viewing friend-requests of the person
router.get("/friendRequests/:userID", viewFriendRequestHandler); // working API
// endpoint for accepting the friend-requests of the user
router.post("/friend-request/accept/:userID", acceptFriendRequestHandler); // working but not properly
// endpoint to display all the followers of the current logged-in user
router.get("/followers/:userID", viewFollowersHandler); //working API
// endpoint to display all the following of the current logged-in user
router.get("/followings/:userID", viewFollowingsHandler); // working API
// endpoint to display all the followers of the normal user
router.get("/followers", fetchFollowersHandler); // working API
// endpoint for displaying the following of the normal user
router.get("/following", fetchFollowingHandler); // working API
// endpoint for uploading the post of the user
router.post("/upload-post/:userID", uploadPostHandler); // working API
// endpoint for deleting the post
router.delete("/delete-post/:userID", deletePostHandler); // working API
// endpoint for updating the description of the user post
router.put("/update-post-description/:userID", updatePostDescriptionHandler); // working API
// endpoint for fetching the posts for the user feed
router.get("/posts", postHandler); // working API
// endpoint for fetching currently logged in user posts
router.get("/userPosts/:userID", userPostHandler); // working API
// fetch normal user posts on profile visit
router.get("/fetchPosts/:userID", fetchPostsHandler); // working API
// endpoint for liking the post
router.post("/like-posts/:userID", likePostsHandler); // working API
// endpoint for commenting on the post
router.post("/comment-posts/:userID", commentPostHandler); // working API
// // endpoint for uncommenting/deleting comment from the post
// router.delete('/comment-posts', deleteCommentPostHandler);
// endpoint for finding user by its ID
router.get("/userByID/:userID", fetchUserByID);
// endpoint for searching the user
router.post("/search", searchUserHandler);

// endpoint for creating a room
router.post("/create-rooms/:userID", createRoomHandler); // working API
// endpoint for joining the room
router.post("/join-rooms/:userID", joinRoomHandler); // working API
// endpoint for fetching the room details
router.get("/get-room-details/:roomID", fetchRoomDetailsHandler); // working API
// endpoint for fetching the notification details
router.get("/get-notification/:userID", fetchNotificationHandler); // working API

// sending movies as responses
// sending all movies data as responses
router.get("/all-movies", getAllMoviesHandler);
router.get("/bollywood-movies", getBollywoodMoviesHandler);
router.get("/popular-movies", getPopularMoviesHandler);
router.get("/now-playing-movies", getNowPlayingMoviesHandler);
router.get("/tamil-movies", getTamilMoviesHandler);
router.get("/telgu-movies", getTelguMoviesHandler);
router.get("/topRated-movies", getTopRatedMoviesHandler);
router.get("/upcoming-movies", getUpcomingMoviesHandler);
// for searching the movie
router.get("/search-movie/:title", getSearchMovieHandler);

// find by the movie Cast
router.get("/movie-cast/:movieId", fetchMovieCastHandler);
// find the movie Description
router.get("/movie-description/:movieId", fetchMovieDescriptionHandler);

// chatting apis
// endpoint to send message to a person
router.post("/messages", sendMessage);
// endpoint to get the userDetails to design the chatRoom Header!
router.get("/details/:userId", getUserDetails);
// endpoint to fetch the messages between two users in the chatRoom!
router.get("/messages/:senderId/:recepientId", fetchChats);
// endpoint to delete Message from the chatRoom
router.post("/deleteMessages", deleteMessage);


export default router;
