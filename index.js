import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
import authRouter from './routers/authRouter.js'

dotenv.config();
connectDB();

const app =  express();
const port = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth' , authRouter)

app.listen(port , () => {
    console.log(`your server is runing on http://localhost:${port}/`);
})
