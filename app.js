import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db/connectDB.js';
import passport from 'passport';
import userModel from './models/User.js';
configDotenv();

const PORT = process.env.PORT ;
const DB_URL = process.env.DATABASE_URL;

const app = express();
const corsOptions = {
    // set origin to a specific origin 
    origin : process.env.FRONTEND_HOST , // frontend url 
    credentials : true , 
    optionsSuccessStatus : 200 
};


// middlewares 
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize());




// request 
app.get("/" , (req ,res) => {
    res.send({message : "hello world" , status : 200})
})


// Database call 

connectDB(DB_URL)




app.listen(PORT , () => {
    console.log(`server is running at http://localhost:${PORT}`)
})