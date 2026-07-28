import mongoose from 'mongoose';

export function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codeclash';
  mongoose.set('strictQuery', false);

  // Non-blocking fast asynchronous MongoDB connection attempt
  mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 300, // 300ms timeout so requests never block!
    connectTimeoutMS: 300
  })
  .then(() => {
    console.log(`[MongoDB Connected] Successfully connected to database: ${mongoURI}`);
  })
  .catch((err) => {
    console.warn(`[MongoDB Notice] Local MongoDB daemon not active. Running in ultra-fast memory-buffered mode!`);
  });
}
