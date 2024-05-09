import bcrypt from 'bcryptjs';
import express, { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import generateUniqueOTP from '../config/generateOTP';
import sendSMS from '../config/smsService';
import { sendMail } from '../services/authService';

const sendAndSaveOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, mobile, image } = req.body;

        // Validate if the password is present
        if (!password) {
            return res.status(400).json({
                message: "Password is required!"
            });
        }

        // Generate OTP
        const otp = generateUniqueOTP();

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);

        // Save OTP to user document in the database
        await User.findOneAndUpdate({ email }, { name, password: hashedPassword, mobile, image, otp }, { upsert: true });

        // Send OTP to the user's mobile number
        // const response = await sendSMS(mobile, otp);
        const response = await sendMail(email, otp);

        if (response) {
            return next();
        } else {
            return res.status(500).json({
                status: 500,
                message: 'Error sending the OTP to the user'
            });
        }
    } catch (error) {
        console.error('Error sending and saving OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default sendAndSaveOTP;
