import userModel from "../models/User.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import bcrypt from 'bcrypt'
import sendEmailVerificationOTP from "../utils/sendEmailVerification.js";
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

         
           // set cookies 


           // send success response with



           

           
        

        } catch (error) {
            console.log(error);
            res.status(400).json({ status : "failed" , message : "Unable to login , please try again later"});
        }
    }



}


export default userController ;