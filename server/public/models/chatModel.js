"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatModelSchema = new mongoose_1.default.Schema({
    sender_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });
const Chat = mongoose_1.default.model('Chat', chatModelSchema);
exports.default = Chat;
//# sourceMappingURL=chatModel.js.map