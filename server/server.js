import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDb from "./config/mongodb.js";
import authRouter from './routes/authRouter.js';
// Connect to MongoDB
connectDb();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true
}));

// api enddpoints

app.get('/',(req,res)=>{
    res.send('Hello from Express server!');
});
console.log("before api auth");
app.use('/api/auth', authRouter);
console.log("after api auth");






app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});