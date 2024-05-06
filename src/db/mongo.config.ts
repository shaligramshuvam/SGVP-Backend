import mongoose from 'mongoose';
import config from 'config';

const connectToDatabase = async (): Promise<void> => {
  try {
    const DB: string = config.get('DB.URL');
    mongoose.Promise = global.Promise;
    await mongoose.connect(DB);
    console.log(`Connected to the '${DB}' database!`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

export default connectToDatabase;
