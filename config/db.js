import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MongoDB URI is not defined. Make sure the environment variable MONGODB_URI is set.');
    }

    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error in MongoDB connection: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
