import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
           
            console.log('MongoDB Connected: ${conn.connection.host}');

            

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in MongoDB connection: ${error.message}`);
    } 
}

export default connectDB;