import twilio from 'twilio';

// Define a function to send an SMS with the OTP using Twilio
const sendOTPSMS = async (mobile: string, otp: string): Promise<string> => {
    try {
        // Your Twilio account credentials
        const TWILIO_ACCOUNT_SID = process.env.Account_SID;
        const TWILIO_AUTH_TOKEN = process.env.Auth_Token;
        const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
        const TWILIO_SEND_TO = '+91' + mobile

        // Ensure Twilio credentials are defined
        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
            throw new Error('Twilio credentials are not defined');
        }

        // Initialize Twilio client
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        // Construct the message content
        const message = `
            Thank you for registering with our application!
            Your verification code is: ${otp}. 
            Please use this code to complete your registration process. 
            If you have any questions, feel free to reach out to our support team. 
            Welcome aboard!
        `;

        // Send the SMS using Twilio
        const result = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: TWILIO_SEND_TO,
        });

        // Return the message SID for reference
        return result.sid;
    } catch (error) {
        // Handle any errors and re-throw
        console.error('Error sending SMS:', error);
        throw error;
    }
};

export default sendOTPSMS;
