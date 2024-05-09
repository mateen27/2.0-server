import mongoose , { Document, Schema } from "mongoose";

interface ChatInterface extends Document {
    sender_id: mongoose.Schema.Types.ObjectId,
    receiver_id: mongoose.Schema.Types.ObjectId,
    message: string,
    date: Date
}

const chatModelSchema: Schema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    receiver_id : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'User'
    },
    message : {
        type : String , 
        required : true
    },
    date : {
        type : Date , 
        default : Date.now()
    }
},
{ timestamps: true })

const Chat = mongoose.model<ChatInterface>('Chat', chatModelSchema);

export default Chat;