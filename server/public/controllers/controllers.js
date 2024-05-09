"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNotificationHandler = exports.fetchRoomDetailsHandler = exports.searchUserHandler = exports.joinRoomHandler = exports.createRoomHandler = exports.fetchUserByID = exports.getUpcomingMoviesHandler = exports.getTopRatedMoviesHandler = exports.getTelguMoviesHandler = exports.getTamilMoviesHandler = exports.getNowPlayingMoviesHandler = exports.getPopularMoviesHandler = exports.getBollywoodMoviesHandler = exports.getAllMoviesHandler = exports.deleteCommentPostHandler = exports.commentPostHandler = exports.likePostsHandler = exports.fetchPostsHandler = exports.userPostHandler = exports.postHandler = exports.updatePostDescriptionHandler = exports.deletePostHandler = exports.uploadPostHandler = exports.fetchFollowingHandler = exports.fetchFollowersHandler = exports.viewFollowingsHandler = exports.viewFollowersHandler = exports.acceptFriendRequestHandler = exports.viewFriendRequestHandler = exports.sendFriendRequestHandler = exports.fetchAllUsersHandler = exports.verifiedUser = exports.registerUserHandler = exports.loginUserHandler = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const authService_1 = require("../services/authService");
const mongoose_1 = __importDefault(require("mongoose"));
const postModel_1 = __importDefault(require("../models/postModel"));
// movies data
const fs = __importStar(require("fs"));
const path_1 = require("../path");
const roomModel_1 = __importStar(require("../models/roomModel"));
// importing uuid for random ID generation
const uuid_1 = require("uuid");
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
// logic for signing the user inside of the application
const loginUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the input values which user provided in the front-end
        const { email, password } = req.body;
        // check if the email and password are provided or not!
        if (email === undefined ||
            password === undefined ||
            !email ||
            !password ||
            email === "" ||
            password === "") {
            return res.status(400).json({
                status: 400,
                message: "Please provide email and password",
            });
        }
        // checking if the user is authenticated in database or not!
        const user = yield (0, authService_1.findUserByEmailAndPassword)(email, password);
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
            const token = yield (0, authService_1.generateToken)(user._id);
            if (token) {
                // token is generated
                return res.status(200).json({
                    user,
                    token,
                });
            }
            else {
                // token is not generated
                return res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                });
            }
        }
        else {
            // user not found or invalid credentials
            return res.status(404).json({
                status: 404,
                message: "Invalid email or password",
            });
        }
    }
    catch (error) {
        console.error("Error during login!", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.loginUserHandler = loginUserHandler;
// logic for registering the user inside of the application
const registerUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // try accessing the details of the user
        const { email } = req.body;
        // Calling a function in the service to handle database operations!
        const user = yield (0, authService_1.isAlreadyRegistered)(email);
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error Registering the user!", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.registerUserHandler = registerUserHandler;
// logic for sending the user has been verified into the database
// Endpoint for handling verified user
const verifiedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "User verified successfully" });
    }
    catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.verifiedUser = verifiedUser;
// logic for fetching all the users of the application except the logged in user & sent friendRequest and in friendRequest person
const fetchAllUsersHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the logged in user's profile
        const loggedInUser = req.params.userID;
        // Making the query in the database where _id does not include the loggedInUserId
        const users = yield (0, authService_1.listAllUsersExceptLoggedIn)(loggedInUser);
        res.status(200).json({ users });
    }
    catch (error) {
        console.log("Error fetching the users:", error);
        res.status(500).json({ message: "Error fetching all the users!" });
    }
});
exports.fetchAllUsersHandler = fetchAllUsersHandler;
// logic for sending friend requests to the person!
const sendFriendRequestHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // recepient user ID
        const { selectedUserId } = req.body;
        // current user ID
        const { userID } = req.params;
        // update the sender's sentFriendRequest [add recipientId to their friend requests sent list]
        const senderResponse = yield (0, authService_1.updateSentFriendRequests)(userID, selectedUserId);
        // update the recipient's sentFriendRequest [add senderId to their friend requests sent list]
        const recipientResponse = yield (0, authService_1.updateFriendRequests)(selectedUserId, userID);
        // return the response
        res.status(200).json({ senderResponse, recipientResponse });
    }
    catch (error) {
        console.log("error sending friend request");
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.sendFriendRequestHandler = sendFriendRequestHandler;
// logic for viewing all the friend requests of the current user
const viewFriendRequestHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the logged in user's profile ID
        const { userID } = req.params;
        const users = yield (0, authService_1.fetchFriendRequests)(userID);
        res.status(200).json({ users });
    }
    catch (error) {
        console.log("error fetching the friend requests of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.viewFriendRequestHandler = viewFriendRequestHandler;
// logic for accepting the friend-request of the user
const acceptFriendRequestHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accesing the userID and the recipient ID of the user
        const { userID } = req.params;
        const { recepientID } = req.body;
        // redirecting to the services file
        yield (0, authService_1.acceptFriendRequest)(userID, recepientID);
        const existingUser = yield userModel_1.default.findById(userID);
        if (existingUser) {
            yield (0, authService_1.createNotificationn)(recepientID, `Your friend request has been accepted by ${existingUser.name}.`, "friend_request_accepted", '' // Empty string as placeholder for postId
            );
        }
        // send the reponse back to the client
        res.status(200).json({ success: true, message: "Friend request accepted" });
    }
    catch (error) {
        console.log("error accepting the friend request of the user", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.acceptFriendRequestHandler = acceptFriendRequestHandler;
// logic for displaying all the followers of the logged in user
const viewFollowersHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accesing userID from the params
        const { userID } = req.params;
        // finding if the user the user exists or not
        const user = yield (0, authService_1.fetchFollowers)(userID);
        const followers = user === null || user === void 0 ? void 0 : user.followers;
        res.status(200).json(followers);
    }
    catch (error) {
        console.log("error fetching the followers of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.viewFollowersHandler = viewFollowersHandler;
// logic for displaying all the followings of the user
const viewFollowingsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the userID
        const { userID } = req.params;
        // finding if the user the user exists or not
        const user = yield (0, authService_1.fetchFollowing)(userID);
        // accesianing the following of the user
        const following = user === null || user === void 0 ? void 0 : user.following;
        // returning the response
        res.status(200).json(following);
    }
    catch (error) {
        console.log("error fetching the followers of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.viewFollowingsHandler = viewFollowingsHandler;
// logic for displaying the followers of the specific user
const fetchFollowersHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.body;
        // finding if the user exists or not
        const user = yield (0, authService_1.fetchUserFollowersHandler)(userID);
        const followers = user === null || user === void 0 ? void 0 : user.followers;
        res.status(200).json(followers);
    }
    catch (error) {
        console.log("error fetching the followers of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.fetchFollowersHandler = fetchFollowersHandler;
// logic for displaying the following of the user of the specified user
const fetchFollowingHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the userID from the body
        const { userID } = req.body;
        // finding if the user exists or not
        const user = yield (0, authService_1.fetchUserFollowingHandler)(userID);
        // accessing the following of the user
        const following = user === null || user === void 0 ? void 0 : user.following;
        res.status(200).json(following);
    }
    catch (error) {
        console.log("error fetching the following of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.fetchFollowingHandler = fetchFollowingHandler;
// logic for uploading the post to the server
const uploadPostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the userID from the params
        const { userID } = req.params;
        const { type, contentUrl, contentDescription } = req.body;
        // checking if the user exists or not
        const existingUser = yield userModel_1.default.findById(userID);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // creating the post for the user
        const newPost = new postModel_1.default({
            type,
            contentUrl,
            contentDescription,
            userID,
            likes: [],
            comments: [],
        });
        // save the post to the database
        const savedPost = yield newPost.save();
        // update the user's uploadedPosts array with the new post's ID
        yield (0, authService_1.updateUserUploadedPosts)(userID, savedPost);
        res
            .status(201)
            .json({ message: "Post uploaded successfully", post: savedPost });
    }
    catch (error) {
        console.log("error uploading the post", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.uploadPostHandler = uploadPostHandler;
// endpoint for deleting the post uploaded by the user
const deletePostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the userID from params and postID from the body
        const { userID } = req.params;
        const { postID } = req.body;
        // checking if the user exists or not
        const existingUser = yield (0, authService_1.findUserByID)(userID);
        // user not found
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // checking if the post exists or not
        const post = yield (0, authService_1.findPostById)(postID);
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
        yield postModel_1.default.deleteOne({ _id: postID });
        // Remove the post from the user's uploadedPosts array
        yield userModel_1.default.findByIdAndUpdate(userID, { $pull: { uploadedPosts: postID } });
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        console.log("error deleting the post uploaded by the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deletePostHandler = deletePostHandler;
// endpoint for udating the description of the user post which he have uploaded
const updatePostDescriptionHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the userID from the params and accessing the post ID and description from the body
        const { userID } = req.params;
        const { postID, description } = req.body;
        const userIDObj = new mongoose_1.default.Types.ObjectId(userID);
        // checking if the post exists or not
        const post = yield (0, authService_1.findPostById)(postID);
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
        const updatedPost = yield post.save();
        res
            .status(200)
            .json({
            message: "Post description updated successfully",
            post: updatedPost,
        });
    }
    catch (error) {
        console.log("error updating the description of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updatePostDescriptionHandler = updatePostDescriptionHandler;
// endpoint for displaying the posts on to the feed of the application
const postHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching the posts fro the feed
        const posts = yield (0, authService_1.fetchPosts)();
        return res
            .status(200)
            .json({ message: "Posts fetched successfully", post: posts });
    }
    catch (error) {
        console.log("error fetching the posts on to the feed of the application", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.postHandler = postHandler;
// endpoint for fetching the posts of the logged in user
const userPostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the userID from the parameters
        const { userID } = req.params;
        // checking if the user is authenticated
        const user = yield (0, authService_1.findUserByID)(userID);
        // user does not exist
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        // fetching the user's posts from the database
        const posts = yield (0, authService_1.fetchUserPosts)(userID);
        return res
            .status(200)
            .json({ message: "Posts successfully fetched", post: posts });
    }
    catch (error) {
        console.log("error fetching the posts of the logged in user", error);
        res
            .status(500)
            .json({ message: "Error fetching the posts of the logged in user" });
    }
});
exports.userPostHandler = userPostHandler;
// endpoint for fetching the posts of the specific user
const fetchPostsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accesing the posts of the user only when the user is following the user
        const { userID } = req.params;
        const { recipientID } = req.body;
        // Checking if the current user is following the recipient
        const currentUser = yield userModel_1.default.findById(userID);
        const isFollowing = currentUser === null || currentUser === void 0 ? void 0 : currentUser.following.includes(recipientID);
        // when the user is not following the user
        if (!isFollowing) {
            return res
                .status(403)
                .json({ message: `You are not authorized to view this user\'s posts` });
        }
        // fetch the users posts
        const post = yield postModel_1.default.find({ userID: recipientID }).populate("userID", "name email");
        res.status(200).json({ post });
    }
    catch (error) {
        console.log("error fetching posts of the specific user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.fetchPostsHandler = fetchPostsHandler;
// endpoint for liking the post of the user and notifying the user
const likePostsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accessing the userID from the parameters
        const { userID } = req.params;
        // accessing the postID from the body
        const { postID } = req.body;
        const userIDObj = new mongoose_1.default.Types.ObjectId(userID);
        const postIdObj = new mongoose_1.default.Types.ObjectId(postID);
        // checking if the user exists or not
        const existingUser = yield userModel_1.default.findById(userIDObj);
        // user not found
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // checking if the post exists or not
        const post = yield postModel_1.default.findById(postIdObj);
        // post not found
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // checking if the user has already liked the post
        if (post.likes.includes(userIDObj)) {
            post.likes = post.likes.filter((like) => !like.equals(userIDObj));
            yield post.save();
            yield (0, authService_1.createNotification)(post.userID.toString(), `${existingUser.name} unliked your post.`, "unlike", postID);
            return res.status(400).json({ message: "Post unliked successfully" });
        }
        // if the user has not liked the post yet
        post.likes.push(userIDObj);
        yield post.save();
        // send like notification
        yield (0, authService_1.createNotification)(post.userID.toString(), `${existingUser.name} liked your post.`, "like", postID);
        res.status(200).json({ message: "Post liked successfully" });
    }
    catch (error) {
        console.log("Error liking post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.likePostsHandler = likePostsHandler;
// endpoint for commenting on the post of the user
const commentPostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accesing the params and body
        const { userID } = req.params;
        const { postID, comment } = req.body;
        // converting the iDS to Object ID
        const userIDObj = new mongoose_1.default.Types.ObjectId(userID);
        const postIdObj = new mongoose_1.default.Types.ObjectId(postID);
        // checking if the user exists or not
        const existingUser = yield userModel_1.default.findById(userIDObj);
        // user not found
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // checking if the post exists or not
        const post = yield postModel_1.default.findById(postIdObj);
        // post not found
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // add comments to the post if the post already exists
        post.comments.push({ userID: userIDObj, text: comment });
        yield post.save();
        // Notify the user who have commented to the post
        // checking which user posted the post
        const postByUser = yield userModel_1.default.findById(post.userID);
        if (postByUser) {
            yield (0, authService_1.createNotification)(post.userID.toString(), `${existingUser.name} commented on your post.`, "comment", postID);
        }
        res.status(200).json({ message: "Comment posted successfully" });
    }
    catch (error) {
        console.log("error commenting on post", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.commentPostHandler = commentPostHandler;
// endpoint for deleteing the post comments
const deleteCommentPostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, postID, commentID } = req.body;
        const userIDObj = new mongoose_1.default.Types.ObjectId(userID);
        const postIDObj = new mongoose_1.default.Types.ObjectId(postID);
        const commentIDObj = new mongoose_1.default.Types.ObjectId(commentID);
        // Check if the user is authorized to delete the post
        const post = yield postModel_1.default.findOne({ _id: postIDObj, userID: userIDObj });
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
    }
    catch (error) {
        console.log("Error deleting comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteCommentPostHandler = deleteCommentPostHandler;
// endpoint for sending movies responses
const getAllMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.ALL_MOVIES, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllMoviesHandler = getAllMoviesHandler;
const getBollywoodMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.BollywoodMovies, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getBollywoodMoviesHandler = getBollywoodMoviesHandler;
const getPopularMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.PopularMovies, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getPopularMoviesHandler = getPopularMoviesHandler;
const getNowPlayingMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.NowPlayingMovies, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getNowPlayingMoviesHandler = getNowPlayingMoviesHandler;
const getTamilMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.TamilMovies, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getTamilMoviesHandler = getTamilMoviesHandler;
const getTelguMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.TelguMovies, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getTelguMoviesHandler = getTelguMoviesHandler;
const getTopRatedMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.TopRatedMovies, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getTopRatedMoviesHandler = getTopRatedMoviesHandler;
const getUpcomingMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read the JSON data from the file
        fs.readFile(path_1.UpcomingMovies, "utf8", (err, data) => {
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
    }
    catch (error) {
        console.log("error fetching the movies", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getUpcomingMoviesHandler = getUpcomingMoviesHandler;
// Controller function to fetch user by ID and populate email and name
const fetchUserByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user ID from request parameters
        const { userID } = req.params;
        // Find the user by ID and populate the email and name fields
        const user = yield userModel_1.default.findById(userID).select("email name").exec();
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // If the user exists, return the user data
        res.status(200).json({ user });
    }
    catch (error) {
        // Handle errors
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.fetchUserByID = fetchUserByID;
// Endpoint for creating a room
const createRoomHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { movieID, movieName, movieLink } = req.body; // Destructure movie details from request body
        // Find all active rooms created by the user
        const activeRooms = yield roomModel_1.default.find({ hostUserId: userID, status: 'active' });
        // Set status of all active rooms except the current one to 'ended'
        yield Promise.all(activeRooms.map((room) => __awaiter(void 0, void 0, void 0, function* () {
            if (room.roomID !== req.body.roomID) {
                room.status = 'ended';
                yield room.save();
            }
        })));
        // convert the string userID to mongoose ObjectID
        const userId = new mongoose_1.default.Types.ObjectId(userID);
        // Create new room
        const roomId = (0, uuid_1.v4)(); // Generate a random unique roomId
        const movieDetails = new roomModel_1.MovieModel({ movieID, movieName, movieLink });
        const roomData = {
            roomID: roomId,
            hostUserId: userId,
            movieDetails: [movieDetails], // Assuming movieDetails is a single Movie object
            status: 'active', // Default status
            createdAt: new Date(),
            usersJoined: [], // Initialize users joined array
            users: [], // Initialize users array
        };
        const room = yield roomModel_1.default.create(roomData);
        res.status(201).json({ room, roomId }); // Send roomId in the response
    }
    catch (error) {
        console.log('Error creating room:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createRoomHandler = createRoomHandler;
// endpoint for joining the room
const joinRoomHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { roomID } = req.body;
        // Find the room by ID
        const room = yield roomModel_1.default.findOne({ roomID });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        // Convert the string userID to mongoose.Types.ObjectId
        const userId = new mongoose_1.default.Types.ObjectId(userID);
        // Check if the user is already in the room
        const userInRoom = room.users.some(user => user.equals(userId));
        // if (userInRoom) {
        //   return res.status(400).json({ error: 'User already in the room' });
        // }
        // Add the user to the room
        room.users.push(userId);
        room.usersJoined.push({ userId, joinedAt: new Date() });
        yield room.save();
        res.status(200).json(room);
    }
    catch (error) {
        console.log('error joining the room', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.joinRoomHandler = joinRoomHandler;
// endopoint for searching the user
const searchUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.body;
        // Ensure that keyword is a string
        if (typeof keyword !== 'string') {
            throw new Error('Keyword must be a string');
        }
        // Search users whose name contains the keyword (case-insensitive)
        const users = yield userModel_1.default.find({ name: { $regex: new RegExp(keyword, 'i') } });
        // Return the search results
        res.json({ success: true, users: users });
    }
    catch (error) {
        console.log('error searching the user', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.searchUserHandler = searchUserHandler;
// endpoint for fetching the room information
const fetchRoomDetailsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the roomId from the request parameters
        const { roomID } = req.params;
        // Find the room in the database by roomId
        const room = yield roomModel_1.default.findOne({ roomID })
            .populate('hostUserId', 'id name email') // Populate the hostUserId field to get the host details
            .populate('users', 'id name') // Populate the users field to get the user IDs
            .populate('movieDetails')
            .lean();
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        // Get the number of users in the room
        const numberOfUsers = room.users.length;
        // Extract relevant information from the room
        const roomDetails = {
            roomID: room.roomID,
            host: room.users,
            numberOfUsers: numberOfUsers,
            userIds: room.hostUserId, // Include the user IDs
            movieDetails: room.movieDetails
        };
        // Send the room details as a response
        res.status(200).json(roomDetails);
    }
    catch (error) {
        console.log('error fetching the room information', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.fetchRoomDetailsHandler = fetchRoomDetailsHandler;
// endpoint for fetching the Notifications of the Users 
const fetchNotificationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the user ID from the request parameters
        const { userID } = req.params;
        // Use Mongoose to find notifications by user ID
        const notifications = yield notificationModel_1.default.find({ userId: userID });
        // Return the fetched notifications as a response
        res.status(200).json({ notifications });
    }
    catch (error) {
        // Handle any errors that occur during the process
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.fetchNotificationHandler = fetchNotificationHandler;
//# sourceMappingURL=controllers.js.map