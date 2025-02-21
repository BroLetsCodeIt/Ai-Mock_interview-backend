import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db/connectDB.js';
import passport from 'passport';
import router from './routes/userRouter.js';
import './config/passport-jwt-strategy.js'
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


// middlewares s
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize());


// Database call 
connectDB(DB_URL);


// load routes 
app.use('/api/user', router)


app.get("/" , (req ,res) => {
    res.send({message : "hello world" , status : 200})
})




app.listen(PORT , () => {
    console.log(`server is running at http://localhost:${PORT}`)
})