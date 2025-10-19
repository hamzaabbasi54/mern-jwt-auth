import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDb from "./config/mongodb.js";

// Connect to MongoDB
connectDb();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true
}));


app.get('/',(req,res)=>{
    res.send('Hello from Express server!');
});










app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});