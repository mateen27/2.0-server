import mongoose, { Schema, Document } from 'mongoose';

export interface NotificationInterface extends Document {
    message: string;
    type: string; // Example: 'like', 'comment', 'follow'
    postId?: mongoose.Types.ObjectId; 
    userId?: mongoose.Types.ObjectId; 
}

const notificationSchema: Schema = new Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Notification = mongoose.model<NotificationInterface>('Notification', notificationSchema);
export default Notification;