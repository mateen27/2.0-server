"use strict";
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
exports.createNotificationn = exports.sendMail = exports.createNotification = exports.fetchUserPosts = exports.fetchPosts = exports.findPostById = exports.updateUserUploadedPosts = exports.findUserByID = exports.fetchUserFollowingHandler = exports.fetchUserFollowersHandler = exports.fetchFollowing = exports.fetchFollowers = exports.acceptFriendRequest = exports.fetchFriendRequests = exports.updateFriendRequests = exports.updateSentFriendRequests = exports.listAllUsersExceptLoggedIn = exports.isVerified = exports.isAlreadyRegistered = exports.registerToDatabase = exports.generateToken = exports.findUserByEmailAndPassword = void 0;
const notificationModel_1 = __importDefault(require("./../models/notificationModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const postModel_1 = __importDefault(require("../models/postModel"));
// Define the return type as Promise<UserInterface | null> since the function is async
const findUserByEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logic to find the user by email and password
        const user = yield userModel_1.default.findOne({
            email,
        });
        // if user is not found
        if (user === null || !user) {
            // no user is found
            return null;
        }
        // console.log('user is found',user);
        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        // // If passwords match, return the user
        if (isPasswordValid) {
            return user;
        }
        else {
            return null; // Return null indicating invalid password
        }
    }
    catch (error) {
        // Check if error is an instance of Error and has a message property
        if (error instanceof Error && error.message) {
            throw new Error("Error finding user: " + error.message);
        }
        else {
            // If error doesn't have a message property, just throw the original error
            throw error;
        }
    }
});
exports.findUserByEmailAndPassword = findUserByEmailAndPassword;
const generateToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accesing the secret key from .env file
        const secretKey = process.env.SECRET_KEY;
        // accesing the expires in from.env file
        const expiresIn = process.env.SECRET_EXPIRATION;
        if (!secretKey || !expiresIn) {
            throw new Error("Secret key or expiration not provided in environment variables");
        }
        // Generate token using jwt.sign()
        const token = jsonwebtoken_1.default.sign({ userId }, secretKey, { expiresIn });
        return token;
    }
    catch (error) {
        if (error instanceof Error && error.message) {
            throw new Error("Error generating token for user: " + error.message);
        }
        else {
            throw error;
        }
    }
});
exports.generateToken = generateToken;
// function for registering the user inside the database
const registerToDatabase = (name, email, password, mobile, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logic for registering the user in the database
        const newUser = new userModel_1.default({
            name,
            email,
            password,
            mobile,
            image,
        });
        // saving the user inside the database
        yield newUser.save();
        return { message: "User registration successful" };
    }
    catch (error) {
        console.error(`Error Registering the User! : ${error}`);
        throw new Error("Error registering the User!");
    }
});
exports.registerToDatabase = registerToDatabase;
// function for finding if the user is already registered
const isAlreadyRegistered = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logic for finding the user by email and password
        const user = yield userModel_1.default.findOne({
            email,
        });
        // if user is not found
        if (!user) {
            // no user is found
            return { message: "User not found" };
        }
        return user.toObject();
    }
    catch (error) {
        console.error(`Error finding the User! : ${error}`);
        throw new Error("Error finding the User in the Database!");
    }
});
exports.isAlreadyRegistered = isAlreadyRegistered;
// checking if the user is verified or not
// Function to check if the user is verified or not
const isVerified = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(userID);
        return user ? user.verified : false;
    }
    catch (error) {
        console.error("Error checking user verification status:", error);
        return false;
    }
});
exports.isVerified = isVerified;
// function for listing all the users from the database except the one that is logged in & not in friend Request's List!
const listAllUsersExceptLoggedIn = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Find the logged-in user
        const loggedInUser = yield userModel_1.default.findById(userID);
        if (!loggedInUser) {
            throw new Error("Logged-in user not found");
        }
        // Get IDs of users in friend requests, sent friend requests, following, and followers
        const friendRequestIDs = (_a = loggedInUser.friendRequests) !== null && _a !== void 0 ? _a : [];
        const sentFriendRequestIDs = (_b = loggedInUser.sentFriendRequests) !== null && _b !== void 0 ? _b : [];
        const followingIDs = (_c = loggedInUser.following) !== null && _c !== void 0 ? _c : [];
        const followerIDs = (_d = loggedInUser.followers) !== null && _d !== void 0 ? _d : [];
        // Combine all IDs to exclude from the query
        const excludedUserIDs = [
            ...friendRequestIDs,
            ...sentFriendRequestIDs,
            ...followingIDs,
            ...followerIDs,
            userID, // Exclude the logged-in user's ID
        ];
        // Find users who are not the logged-in user and not in any of the lists mentioned above
        const users = yield userModel_1.default.find({
            _id: { $nin: excludedUserIDs }
        });
        return users;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Error fetching users");
    }
});
exports.listAllUsersExceptLoggedIn = listAllUsersExceptLoggedIn;
// function to set sender's sent friendRequest with recepient id
const updateSentFriendRequests = (currentUserID, recepientUserID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // updating the sender's sent friendRequest
        yield userModel_1.default.findByIdAndUpdate(currentUserID, {
            $push: {
                sentFriendRequests: recepientUserID,
            },
        });
        return `Successfully updated sender's sent friendRequest with Recipient ID`;
    }
    catch (error) {
        console.log("error updating sender sent friend request list", error);
        return "Error updating sender sent friend request list";
    }
});
exports.updateSentFriendRequests = updateSentFriendRequests;
// function to set recepient's friendRequest with sender id
const updateFriendRequests = (recepientUserID, currentUserID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // updating the recepient's friendRequest
        yield userModel_1.default.findByIdAndUpdate(recepientUserID, {
            $push: {
                friendRequests: currentUserID,
            },
        });
        return `Successfully updated recepient's friendRequest with Sender ID`;
    }
    catch (error) {
        console.log("error updating recepient friend request list", error);
        return "Error updating recepient friend request list";
    }
});
exports.updateFriendRequests = updateFriendRequests;
// function for fetching the friend requests of the user
const fetchFriendRequests = (currentUserID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(currentUserID).populate({
            path: "friendRequests",
            select: "name email image",
            model: "User"
        }).lean();
        if (!user) {
            throw new Error('User not found');
        }
        return user.friendRequests.map((friend) => ({
            _id: friend._id,
            name: friend.name,
            email: friend.email,
            image: friend.image,
        }));
    }
    catch (error) {
        console.log("Error fetching friend requests of the user", error);
        throw new Error("Error fetching friend requests of the user");
    }
});
exports.fetchFriendRequests = fetchFriendRequests;
// function for accepting the friend request of the users
const acceptFriendRequest = (userID, recepientID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert strings to ObjectId
        const senderId = new mongoose_1.default.Types.ObjectId(userID);
        const recepientId = new mongoose_1.default.Types.ObjectId(recepientID);
        if (!mongoose_1.default.Types.ObjectId.isValid(senderId) || !mongoose_1.default.Types.ObjectId.isValid(recepientId)) {
            throw new Error("Invalid sender or recipient ID.");
        }
        // Query sender and recipient documents
        const sender = yield userModel_1.default.findById(senderId);
        const recepient = yield userModel_1.default.findById(recepientId);
        // Check if sender and recipient exist
        if (!sender || !recepient) {
            throw new Error("Invalid sender or recipient ID.");
        }
        // Push sender ID to recipient's followers
        recepient.following.push(senderId);
        // Push recipient ID to sender's following
        sender.followers.push(recepientId);
        // Remove sender ID from recipient's friend requests
        recepient.sentFriendRequests = recepient.sentFriendRequests.filter((requestId) => requestId.toString() !== senderId.toString());
        // Remove recipient ID from sender's sent friend requests
        sender.friendRequests = sender.friendRequests.filter((requestId) => requestId.toString() !== recepientId.toString());
        // Save changes
        yield sender.save();
        yield recepient.save();
    }
    catch (error) {
        console.log("Error accepting friend requests of the user", error);
        throw new Error("Error accepting friend requests of the user");
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
// function to fetch all the followers of the user
const fetchFollowers = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.default.findById(userID).populate('followers', "name email mobile image is_online followers following uploadedMovies");
    }
    catch (error) {
        console.log('Error fetching followers', error);
        throw error;
    }
});
exports.fetchFollowers = fetchFollowers;
// function for fetching all the followings of the user
const fetchFollowing = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.default.findById(userID).populate('following', 'name email mobile image is_online followers following uploadedMovies');
    }
    catch (error) {
        console.log('error fetching following', error);
        throw error;
    }
});
exports.fetchFollowing = fetchFollowing;
// function for fetching all the followers of the user
const fetchUserFollowersHandler = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.default.findById(userID).populate('followers', "name email mobile image is_online followers following uploadedMovies");
    }
    catch (error) {
        console.log('error fetching followers of the specified user', error);
        throw error;
    }
});
exports.fetchUserFollowersHandler = fetchUserFollowersHandler;
// function for fetching all the followings of the user
const fetchUserFollowingHandler = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.default.findById(userID).populate('following', 'name email mobile image is_online followers following uploadedMovies');
    }
    catch (error) {
        console.log('error fetching user following', error);
        throw error;
    }
});
exports.fetchUserFollowingHandler = fetchUserFollowingHandler;
// function for finding the user by its id
const findUserByID = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // checking if the user is already present with this user id or not
        const existingUser = yield userModel_1.default.findById(userID);
        // if not present
        if (!existingUser) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.log('error finding the user by its userID', error);
        throw error;
    }
});
exports.findUserByID = findUserByID;
// function for updating the user's uploaded posts data in the backend
const updateUserUploadedPosts = (userID, savedPost) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.default.findByIdAndUpdate(userID, { $push: {
                uploadedPosts: savedPost._id
            } });
    }
    catch (error) {
        console.log('error updating the user uploaded posts data', error);
        throw error;
    }
});
exports.updateUserUploadedPosts = updateUserUploadedPosts;
// function for finding the post by its ID
const findPostById = (postID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use findById to directly retrieve the post from the database
        const existingPost = yield postModel_1.default.findById(postID);
        // If post is not found, return null
        if (!existingPost) {
            return null;
        }
        // If post is found, return the Mongoose model instance
        return existingPost;
    }
    catch (error) {
        console.log('Error finding the post by the post ID', error);
        throw error;
    }
});
exports.findPostById = findPostById;
// function to fetch the posts from the database to display them on the feed list
const fetchPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find().populate('userID', 'name email followers').lean();
        return posts;
    }
    catch (error) {
        console.log('error fetching posts', error);
        throw error;
    }
});
exports.fetchPosts = fetchPosts;
// function for fetching the loggedin user's posts
const fetchUserPosts = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetching the posts of the user from the database
        const posts = yield postModel_1.default.find({ userID }).populate('userID', 'name email').lean();
        return posts;
    }
    catch (error) {
        console.log('error fetching the user posts', error);
        throw error;
    }
});
exports.fetchUserPosts = fetchUserPosts;
// Function to create and save notifications
const createNotification = (recipientID, message, type, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = new notificationModel_1.default({
            message: message,
            type: type,
            postId: postId,
            userId: recipientID,
        });
        yield notification.save();
    }
    catch (error) {
        throw new Error('Error creating notification');
    }
});
exports.createNotification = createNotification;
// function for sending the recepient notification
// Function to create and save notifications
const createNotificationn = (recipientID, message, type, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = new notificationModel_1.default({
            message: message,
            type: type,
            userId: recipientID,
        });
        yield notification.save();
    }
    catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Error creating notification');
    }
});
exports.createNotificationn = createNotificationn;
// function for sending mail to the user containing the otp to verify the user
const sendMail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.PASSWORD,
            }
        });
        const mailOptions = {
            from: "showstarter@gmail.com",
            to: email,
            subject: "OTP Verification",
            html: `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h1>Welcome to ShowStarter!</h1>
          <p>Thank you for registering with our application!</p>
          <p>Your verification code is: <strong>${otp}</strong>.</p>
          <p>Please use this code to complete your registration process.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Welcome aboard!</p>
        </body>
      </html>
    `
        };
        yield transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
        return true;
    }
    catch (error) {
        console.log('error sending the mail to the user');
        return false;
    }
});
exports.sendMail = sendMail;
// Intel
// Microsoft
// Paytm Payment Banks
//# sourceMappingURL=authService.js.map