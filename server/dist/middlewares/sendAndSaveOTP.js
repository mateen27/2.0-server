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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateOTP_1 = __importDefault(require("../config/generateOTP"));
const authService_1 = require("../services/authService");
const sendAndSaveOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, mobile, image } = req.body;
        // Validate if the password is present
        if (!password) {
            return res.status(400).json({
                message: "Password is required!"
            });
        }
        // Generate OTP
        const otp = (0, generateOTP_1.default)();
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = yield bcryptjs_1.default.hash(password.toString(), saltRounds);
        // Save OTP to user document in the database
        yield userModel_1.default.findOneAndUpdate({ email }, { name, password: hashedPassword, mobile, image, otp }, { upsert: true });
        // Send OTP to the user's mobile number
        // const response = await sendSMS(mobile, otp);
        const response = yield (0, authService_1.sendMail)(email, otp);
        if (response) {
            return next();
        }
        else {
            return res.status(500).json({
                status: 500,
                message: 'Error sending the OTP to the user'
            });
        }
    }
    catch (error) {
        console.error('Error sending and saving OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = sendAndSaveOTP;
//# sourceMappingURL=sendAndSaveOTP.js.map