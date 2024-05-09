import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;

        // Find the user by ID and check if OTP matches
        const user = await User.findOne({ _id: req.params.userID, otp });

        if (user) {
            // OTP matches, update user's verification status and remove OTP from user document
            await User.findByIdAndUpdate(req.params.userID, { verified: true, otp: null });

            // Proceed to the next middleware or route handler
            return next();
        } else {
            // OTP does not match or user not found
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default verifyOTP;
