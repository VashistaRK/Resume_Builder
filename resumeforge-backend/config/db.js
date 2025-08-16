import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://shoterking1357:MainKey123@cluster0.3kun17m.mongodb.net/ResumeForge')
    .then(() => console.log('MongoDB Connected...'))
}