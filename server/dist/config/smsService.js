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
const twilio_1 = __importDefault(require("twilio"));
// Define a function to send an SMS with the OTP using Twilio
const sendOTPSMS = (mobile, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Your Twilio account credentials
        const TWILIO_ACCOUNT_SID = process.env.Account_SID;
        const TWILIO_AUTH_TOKEN = process.env.Auth_Token;
        const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
        const TWILIO_SEND_TO = '+91' + mobile;
        // Ensure Twilio credentials are defined
        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
            throw new Error('Twilio credentials are not defined');
        }
        // Initialize Twilio client
        const client = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        // Construct the message content
        const message = `
            Thank you for registering with our application!
            Your verification code is: ${otp}. 
            Please use this code to complete your registration process. 
            If you have any questions, feel free to reach out to our support team. 
            Welcome aboard!
        `;
        // Send the SMS using Twilio
        const result = yield client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: TWILIO_SEND_TO,
        });
        // Return the message SID for reference
        return result.sid;
    }
    catch (error) {
        // Handle any errors and re-throw
        console.error('Error sending SMS:', error);
        throw error;
    }
});
exports.default = sendOTPSMS;
//# sourceMappingURL=smsService.js.map