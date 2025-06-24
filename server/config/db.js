import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log('DB connected');
    });

    mongoose.connection.on("error", (err) => {
        console.error('DB connection error:', err);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/jobFlow`);
};

export default connectDB;