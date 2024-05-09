import mongoose, { Document, Schema } from "mongoose";

// Define movie schema
export interface Movie extends Document {
    movieID: string;
    movieName: string;
    movieLink: string;
  }
  
  const movieSchema: Schema = new mongoose.Schema<Movie>({
    movieID: { type: String, required: true },
    movieName: { type: String, required: true },
    movieLink: { type: String, required: true },
  });
  
  export const MovieModel = mongoose.model<Movie>('Movie', movieSchema);

// Room model schema in MongoDB
export interface Room extends Document {
    roomID: string;
    hostUserId: mongoose.Types.ObjectId;
    movieDetails: Movie[];
    users: mongoose.Types.ObjectId[];
    status: string;
    createdAt: Date;
    usersJoined: { userId: mongoose.Types.ObjectId, joinedAt: Date }[];
  }
  
  const roomSchema: Schema = new mongoose.Schema<Room>({
    roomID: { type: String, required: true, unique: true },
    hostUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieDetails: [movieSchema],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    usersJoined: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      joinedAt: { type: Date, default: Date.now }
    }]
  });
  
  const RoomModel = mongoose.model<Room>('Room', roomSchema);

  export default RoomModel
