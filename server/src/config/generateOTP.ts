// Function to generate a unique six-digit OTP
const generateUniqueOTP = (): string => {
    const otpLength = 6;
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    const generatedOTPs: Set<string> = new Set();

    while (true) {
        const otp = Math.floor(Math.random() * (max - min + 1)) + min;
        const otpString = otp.toString();

        // Check if OTP is unique
        if (!generatedOTPs.has(otpString)) {
            generatedOTPs.add(otpString);
            return otpString;
        }
    }
};


console.log('new otp generated' , generateUniqueOTP());

export default generateUniqueOTP;