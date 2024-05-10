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
const userModel_1 = __importDefault(require("../models/userModel"));
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        // Find the user by ID and check if OTP matches
        const user = yield userModel_1.default.findOne({ _id: req.params.userID, otp });
        if (user) {
            // OTP matches, update user's verification status and remove OTP from user document
            yield userModel_1.default.findByIdAndUpdate(req.params.userID, { verified: true, otp: null });
            // Proceed to the next middleware or route handler
            return next();
        }
        else {
            // OTP does not match or user not found
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = verifyOTP;
//# sourceMappingURL=verifyOTP.js.map