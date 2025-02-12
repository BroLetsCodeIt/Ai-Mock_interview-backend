import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';


configDotenv();
const app = express();

const corsOptions = {
    // set origin to a specific origin 
    origin : 'http://localhost:3000' , // frontend url 
    credentials : true , 
    optionsSuccessStatus : 200 ,
};

app.use(cors(corsOptions))


app.get("/" , (req ,res) => {
    res.send({message : "hello world" , status : 200})
})




const PORT = process.env.PORT ;
app.listen(PORT , () => {
    console.log(`server is running at http://localhost:${PORT}`)
})