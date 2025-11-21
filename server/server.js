import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDb from "./config/mongodb.js";
import authRouter from './routes/authRouter.js';
import userRouter from "./routes/userRoutes.js";
// Connect to MongoDB
connectDb();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:4000",
    credentials: true
}));


// api enddpoints

app.get('/',(req,res)=>{
    res.send('Hello from Express server!');
});
app.use('/api/auth', authRouter);
console.log("before api auth");
app.use('/api/user', userRouter);
console.log("after user");

console.log("Loaded JWT secret =", process.env.JWT_SECRET);





app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});