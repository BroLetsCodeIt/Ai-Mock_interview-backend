import userModel from "../models/User.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import bcrypt from 'bcrypt'
import sendEmailVerificationOTP from "../utils/sendEmailVerification.js";
import generateToken from "../utils/generateToken.js";
import setTokensCookies from "../utils/setTokenCookies.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import userRefreshTokenModel from "../models/UserRefreshToken.js";
import { configDotenv } from "dotenv";
import jwt from 'jsonwebtoken'
import transporter from "../config/emailConfig.js";



configDotenv();
class userController {

    // user registration 
    // user email verification 
    // user login 
    // get new user token or refresh token 
    // change password 
    // Profile or logged in user 
    // send password reset email 
    // password reset 
    // logout

    static userRegistration = async (req, res) => {
        try {
            const { name, email, password, password_confirmation } = req.body;
            // validate input 
            if (!name || !email || !password || !password_confirmation) {
                return res.status(400).json({ status: "failed", message: "All fields are required" });
            }
            // password matching 
            if (password !== password_confirmation) {
                return res.status(400).json({ status: "failed", message: "Password & confirm password does not match." });
            }

            // Check if user already exists 
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ status: "failed", message: "Email already exists" });
            }

            // password hashing 

            const generateSalt = await bcrypt.genSalt(Number(process.env.SALT));

            const hashedPassword = await bcrypt.hash(password, generateSalt);

            // save the details in the model 

            const newUser = new userModel({ name, email, password: hashedPassword });

            await newUser.save();

            sendEmailVerificationOTP(req ,newUser);

            res.status(200).json({ 
                 status: "success",
                 message: "User registered Successfully" ,
                 user : {"name" : newUser.name , "email" : newUser.email} 
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "failed", message: "Unable to register, please try again later." });
        }
    }

    static VerifyEmail = async (req ,res) => {
         try {

            const { email , otp } = req.body ;

            if(!email || !otp) {
                 return res.status(400).json({status : "failed" , message : "All fields are required."})
            }

            const existingUser = await userModel.findOne({email});

            if(!existingUser){
                return res.status(404).json({status : "failed" , message : "Email doesn't exists"});
            }

            if(existingUser.is_verified){
                return res.status(400).json({status : "failed" , message : "Email already verified"});
            }

            // check if there is matching email verification otp 

            const emailVerification = await EmailVerificationModel.findOne({ userId : existingUser._id , otp});

            if(!emailVerification){ // after 15m it will remove that's why we are checking
                if(!existingUser.is_verified){
                    // if otp email is deleted by user.
                    await sendEmailVerificationOTP(req, existingUser);
                    return res.status(400).json({status : "failed" , message : "Invalid OTP, new OTP sent to your email"})
                }
                return res.status(400).json({status : "failed" , message : "Invalid OTP"});
            }

            // OTP expires 

            const currentTime = new Date() ;
            const expirationTime = new Date(emailVerification.createdAt.getTime() + (15 * 60 * 1000));

            if(currentTime > expirationTime) {
                // OTP expired , send new OTP
                await sendEmailVerificationOTP(req , existingUser);
                return res.status(400).json({status : "failed" , message : "OTP expired , new OTP sent to your email"})
            }

            existingUser.is_verified = true ;
            await existingUser.save(); 


            // delete email verification document 

            await EmailVerificationModel.deleteMany({userId : existingUser._id});

            return res.status(200).json({status : "success" , message : "Email Verified Successfully"});
            
         } catch (error) {
            console.log(error)
            res.status(400).json({status : "failed" , message : "Unable to verify Email , please try again later"})
         } 
        
    }


    static userLogin = async (req , res) => {
        try {
            
           const { email , password} = req.body ;
          
           // check if email and password exists 

           if(!email || !password) {
              return res.status(400).json({status : "failed" , message : "All fields are required"});
           }
    
           const user = await userModel.findOne({email});
         
           // check if user exist

           if(!user){
              return res.status(404).json({status : "failed", message : "Invalid Email or password"});
           }

           // check if user is verified or not 

           if(!user.is_verified){
               return res.status(404).json({status : "failed" , message : "Your account is not verified"});
           }

           const isMatch = await bcrypt.compare(password , user.password);
           
           if(!isMatch){
              return res.status(401).json({status : "failed" , message : "Invalid email or password"});
           }


           // Generate Tokens 

           
           const {accessToken , accessTokenExp , refreshToken , refreshTokenExp} = await generateToken(user);
           
           // set cookies 


           setTokensCookies(res , accessToken , accessTokenExp , refreshToken , refreshTokenExp);     



           // send success response with tokens
           res.status(200).json({
             user : {id : user._id , email : user.email , name : user.name , roles: user.roles[0]} ,
             status : "success" , 
             message : "login successfull" ,
             access_token : accessToken , 
             refresh_token : refreshToken ,
             access_token_exp : accessTokenExp ,
             is_auth : true
           })
        
        } catch (error) {
            console.log(error);
            res.status(400).json({ status : "failed" , message : "Unable to login , please try again later"});
        }
    }

    // get newAccessToken 
    static getNewAccessToken = async (req ,res) => {
       
        try {

            // Get new access token using refresh token 
            const {newAccessToken , newRefreshToken , newAccessTokenExp , newRefreshTokenExp} = await refreshAccessToken(req ,res);
           
            // set new tokens to cookies
            setTokensCookies(res, newAccessToken , newAccessTokenExp , newRefreshToken , newRefreshTokenExp);


            res.status(200).send({
                status : "success" , 
                message : "New Tokens generated" , 
                access_token : newAccessToken , 
                refresh_token : newRefreshToken , 
                access_token_exp : newAccessTokenExp
            })
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status : "failed" , 
                message : "Unable to generate new Token , please try again later"
            })
        }

    } 

    // get profile 

    static userProfile = async (req ,res) => {
       res.send({"user" : req.user});
    }

    // logout 
    static userLogout = async (req ,res) => {
       // clear access token and refresh token cookies 
       
       try {

           res.clearCookie('accessToken');
           res.clearCookie('refreshToken');
           res.clearCookie('is_auth');
        
           // Optionally : you can blacklist the refresh token in the database 
           
           /* 
           const refreshToken = req.cookies.refreshToken ;
           
           await userRefreshTokenModel.findOneAndUpdate(
            {  token : refreshToken },
            { $set : {blacklisted : true} }
          )
        */
       
          res.status(200).json({status : "success" , message : "Logout successfull"})

       } catch (error) {
          
         console.log(error);
         res.status(500).json({ status : "failed" , message  : "Unable to logout , please try again later"});
           
       }

    }


    // change password 

    static changePassword = async (req ,res) => {

         
        // just take password and confirm password 
        // update in the database 

        try {
            
            const { password , confirm_password} = req.body ;

            if(!password || !confirm_password){
                return res.status(400).json({ status : "failed" , message : "All fields are required"});
            }
    
            if(password !== confirm_password){
                return res.status(400).json({status : "failed" , message : "Password is not matching"});
            }
    
    
            // password hashing 
    
            const generateSalt = await bcrypt.genSalt(Number(process.env.SALT));
    
            const hashedPassword = await bcrypt.hash(password, generateSalt);
    
    
            await userModel.findByIdAndUpdate(req.user._id , {$set : {
                password : hashedPassword
            }})

            //send  success response 

            res.status(200).json({status : "success" , message : "password changed successfully"});


        } catch (error) {
             console.log(error);
             res.status(500).json({status : "failed" , message : "Unable to change password , please try again later"});   
        }

    }

    // Send password Reset Link via Email
    
    static sendUserPasswordResetEmail = async (req , res) => {
        
        try {
            
            // email is required for sending the link 
            const {email} = req.body ;

            if(!email){
                return res.status(400).json({status : "failed" , message : "Email is required"});
            }

            // check if user is present in the database or not 
            const user = await userModel.findOne({email});

            if(!user){
                return res.status(400).json({status : "failed" , message : "Email Doesn't exists."})
            }


            // Generate token for password reset 

            const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
            const token = jwt.sign({userID : user._id}  , secret , { expiresIn : '15m'});

            // Reset Link 

            const resetLink = `${process.env.FRONTEND_HOST}/api/user/reset-password/${user._id}/${token}`;

            


            // send password reset email 

            await transporter.sendMail({
                from : process.env.EMAIL_FROM ,
                to : user.email , 
                subject : "Password Reset Link",
                html : `
                <p>Hello ${user.name} , </p>
                <p><a href="${resetLink}">Click here</a> to reset your password.</p>
                `
            })

            // send success response 

            res.status(200).json({status : "success" , message : "Message sent succesfully."})


            




        } catch (error) {
            
            console.log(error);
            res.status(500).json({status : "failed" , message : "Unable to send password reset email.Please try again later"})
        }
    }

    // password resest of forget password

    static userPasswordReset = async (req ,res) => {
        
         try {
            
           const { password , confirm_password} = req.body ;

          

           // get the userid from the params 

           // from that id we will update the password in the database 

           const { id , token} = req.params ;

           console.log(id , token)


           const user = await userModel.findOne({_id : id});

           if(!user){
             return res.status(404).json({ status : 'failed' , message : "User not found"});
           }

           const new_secret = user.id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

           // Verify token
            try {
                jwt.verify(token, new_secret);
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                return res.status(400).json({ status: "failed", message: "Token expired. Please request a new password reset link." });
                }
                return res.status(400).json({ status: "failed", message: "Invalid token." });
            }

           if(!password || !confirm_password){
            return res.status(400).json({status : "failed" , message : "All fields are required"});
         }


           if(password !== confirm_password){
             return res.status(400).json({status : "failed" , message : "Password doesn't match"});
           }

           // Generate salt and hashed password 

           const salt = await bcrypt.genSalt(10);
           const newHashedPassword = await bcrypt.hash(password , salt);


           // update the password 

           await userModel.findByIdAndUpdate(user._id  , {$set : { password : newHashedPassword}} , { new: true, runValidators: true })

           // send success response 

           res.status(200).json({status : 'success' , message : "Password reset successfully"});

         } catch (error) {
            if(error.name === "TokenExpiredError"){
               return res.status(400).json({status : "failed" , message :"Token expired.Please request a new password reset link."})
            }
            res.status(500).json({ status : "failed" , message : "Something went wrong.Please try again later."})
         }
    }



}


export default userController ;