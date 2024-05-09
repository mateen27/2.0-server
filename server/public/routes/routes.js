"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers/controllers");
const sendAndSaveOTP_1 = __importDefault(require("../middlewares/sendAndSaveOTP"));
const verifyOTP_1 = __importDefault(require("../middlewares/verifyOTP"));
const router = express_1.default.Router();
// Endpoint for logging in the user in the application
router.post('/login', controllers_1.loginUserHandler); // working API
// Endpoint for registering tge user inside of the application
router.post('/register', sendAndSaveOTP_1.default, controllers_1.registerUserHandler); // working API 
// endpoint for verifing the otp of the user in the application
router.post(`/verify/:userID`, verifyOTP_1.default, controllers_1.verifiedUser); // working API 
// endpoint for fetching all the users in the application except the logged in user
router.get('/fetchAllUsers/:userID', controllers_1.fetchAllUsersHandler); // working API
// endpoint for sending friend-requests to the person
router.post('/friendRequests/:userID', controllers_1.sendFriendRequestHandler); // working API
// endpoint for viewing friend-requests of the person
router.get('/friendRequests/:userID', controllers_1.viewFriendRequestHandler); // working API
// endpoint for accepting the friend-requests of the user
router.post('/friend-request/accept/:userID', controllers_1.acceptFriendRequestHandler); // working but not properly
// endpoint to display all the followers of the current logged-in user
router.get('/followers/:userID', controllers_1.viewFollowersHandler); //working API
// endpoint to display all the following of the current logged-in user
router.get('/followings/:userID', controllers_1.viewFollowingsHandler); // working API
// endpoint to display all the followers of the normal user
router.get('/followers', controllers_1.fetchFollowersHandler); // working API
// endpoint for displaying the following of the normal user
router.get('/following', controllers_1.fetchFollowingHandler); // working API
// endpoint for uploading the post of the user
router.post('/upload-post/:userID', controllers_1.uploadPostHandler); // working API
// endpoint for deleting the post 
router.delete('/delete-post/:userID', controllers_1.deletePostHandler); // working API
// endpoint for updating the description of the user post
router.put('/update-post-description/:userID', controllers_1.updatePostDescriptionHandler); // working API
// endpoint for fetching the posts for the user feed
router.get('/posts', controllers_1.postHandler); // working API
// endpoint for fetching currently logged in user posts
router.get('/userPosts/:userID', controllers_1.userPostHandler); // working API
// fetch normal user posts on profile visit
router.get('/fetchPosts/:userID', controllers_1.fetchPostsHandler); // working API
// endpoint for liking the post
router.post('/like-posts/:userID', controllers_1.likePostsHandler); // working API
// endpoint for commenting on the post
router.post('/comment-posts/:userID', controllers_1.commentPostHandler); // working API
// // endpoint for uncommenting/deleting comment from the post
// router.delete('/comment-posts', deleteCommentPostHandler);
// endpoint for finding user by its ID
router.get('/userByID/:userID', controllers_1.fetchUserByID);
// endpoint for searching the user
router.post('/search', controllers_1.searchUserHandler);
// endpoint for creating a room 
router.post('/create-rooms/:userID', controllers_1.createRoomHandler); // working API
// endpoint for joining the room 
router.post('/join-rooms/:userID', controllers_1.joinRoomHandler); // working API
// endpoint for fetching the room details
router.get('/get-room-details/:roomID', controllers_1.fetchRoomDetailsHandler); // working API
// endpoint for fetching the notification details
router.get('/get-notification/:userID', controllers_1.fetchNotificationHandler); // working API
// sending movies as responses
// sending all movies data as responses
router.get('/all-movies', controllers_1.getAllMoviesHandler);
router.get('/bollywood-movies', controllers_1.getBollywoodMoviesHandler);
router.get('/popular-movies', controllers_1.getPopularMoviesHandler);
router.get('/now-playing-movies', controllers_1.getNowPlayingMoviesHandler);
router.get('/tamil-movies', controllers_1.getTamilMoviesHandler);
router.get('/telgu-movies', controllers_1.getTelguMoviesHandler);
router.get('/topRated-movies', controllers_1.getTopRatedMoviesHandler);
router.get('/upcoming-movies', controllers_1.getUpcomingMoviesHandler);
exports.default = router;
//# sourceMappingURL=routes.js.map