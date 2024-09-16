import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/blogtnv");
        console.log("Connection Ok!");
    } catch (error) {
        console.log("Errore ", error);
    }
}

export default connectDb;