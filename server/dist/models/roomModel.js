"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const movieSchema = new mongoose_1.default.Schema({
    movieID: { type: String, required: true },
    movieName: { type: String, required: true },
    movieLink: { type: String, required: true },
});
exports.MovieModel = mongoose_1.default.model('Movie', movieSchema);
const roomSchema = new mongoose_1.default.Schema({
    roomID: { type: String, required: true, unique: true },
    hostUserId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    movieDetails: [movieSchema],
    users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    usersJoined: [{
            userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            joinedAt: { type: Date, default: Date.now }
        }]
});
const RoomModel = mongoose_1.default.model('Room', roomSchema);
exports.default = RoomModel;
//# sourceMappingURL=roomModel.js.map