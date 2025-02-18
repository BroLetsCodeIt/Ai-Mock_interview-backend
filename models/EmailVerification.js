import mongoose from 'mongoose';

// defining -schema 

const emailVerificationSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , ref : 'user' , required : true},
    otp : {type : String , required : true },
    createdAt : {type : Date , default : Date.now , expires : '15m'}
})


// model 

const EmailVerificationModel  = mongoose.model('EmailVerification' , emailVerificationSchema);


export default EmailVerificationModel;