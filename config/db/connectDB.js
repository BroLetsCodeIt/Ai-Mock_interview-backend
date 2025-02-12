import mongoose from "mongoose";

async function connectDB(DATABASE_URL){
   
     try {
         const DB_OPTIONS = {
            dbName : 'ai_mock_interview'
         }
         await mongoose.connect(DATABASE_URL , DB_OPTIONS) 
         console.log("database connected successfully..")
     } catch (error) {
         console.log("ERROR MONGODB : ",error)
     }
}

export default connectDB;