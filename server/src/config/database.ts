import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error in connecting to the database: ${error.message}`);
        process.exit(1);
    }
};

export default connectDatabase;
