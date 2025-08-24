import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
import authRouter from './routers/authRouter.js';
import adminRouter from './routers/adminRouter.js';
import userRouter from './routers/userRouter.js';
import tradeRouter from './routers/tradesRouter.js';

dotenv.config();
connectDB();

const app =  express();
const port = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth' , authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/trades', tradeRouter)

app.listen(port , () => {
    console.log(`your server is runing on http://localhost:${port}/`);
})
