import Notification, { NotificationInterface } from './notificationModel';
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    mobile: string;
    image?: string;
    otp?: number | undefined;
    verified?: boolean;
    friendRequests: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    sentFriendRequests: mongoose.Types.ObjectId[];
    uploadedMovies: {
    count: number;
    movie_links: string[];
    is_online: boolean;
    uploadedPosts: mongoose.Types.ObjectId[];
    notifications: NotificationInterface[];
  };
  }

const userModelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    // default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  otp:{
    type: Number,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  uploadedMovies: {
    count: Number,
    movie_links: [String]
  },
  is_online: {
    type: Boolean,
    default: false,
  },
  uploadedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
  }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }]
}, {
  timestamps: true
});

// encrypting the password
// userModelSchema.pre<UserInterface>('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(this.password, salt);
//   this.password = hashedPassword;
//   next();
// });

const User = mongoose.model<UserInterface>('User', userModelSchema);

export default User;