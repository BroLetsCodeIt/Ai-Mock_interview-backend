import userModel from "../models/User.js";
import bcrypt from 'bcrypt'
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



}


export default userController ;