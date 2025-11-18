import mongoose  from "mongoose";
 import dotenv from "dotenv";
 dotenv.config();
 const connectDb = async () => {
     try{
         console.log("before Connected to MongoDB");
         await mongoose.connect(`${process.env.MONGODB_URL}`);
            console.log('Connected to MongoDB');
        }catch(error){
            console.log('Error connecting to MongoDB:', error);
        }
 }
 export default connectDb;