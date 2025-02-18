import mongoose from "mongoose";
import transporter from "../config/emailConfig.js";
import OTPVerifyLink from "../constant/email_template/otpverifylink.js";
import EmailVerificationModel from "../models/EmailVerification.js";
async function sendEmailVerificationOTP(req , user){
    
    // generate OTP 4 - digit 
    const otp = Math.floor(1000 + Math.random() * 9000);
    

    // save the otp in the database 

    await new EmailVerificationModel({userId : user._id , otp : otp}).save();

    // create the link - otp verification link 
    const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`


    const info = await transporter.sendMail({
       from : process.env.EMAIL_FROM , 
       to : user.email ,
       subject : "OTP - Verify your Email" ,
       html : OTPVerifyLink(user , otpVerificationLink , otp)
       
    })


    console.log("Message Sent: %s" , info.messageId)

    return otp;
}


export default sendEmailVerificationOTP;