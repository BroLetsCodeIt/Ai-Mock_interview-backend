import userModel from "../models/User.js";
import userRefreshTokenModel from "../models/UserRefreshToken.js";
import generateToken from "./generateToken.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async (req , res) => {
    
     try {
        
         const oldRefreshToken = req.cookies.refreshToken ;
         
         // verify the oldRefreshToken (valid or not )
         const { tokenDetails ,  error  } = await verifyRefreshToken(oldRefreshToken);
         
         if(error){
            return res.status(401).send({ status : "failed" , message : "Invalid refresh Token"});
         }

         // Find user based on Refresh Token detail id 

         const user = await userModel.findById(tokenDetails._id);

         const userRefreshToken  =  await userRefreshTokenModel.findOne({userId : tokenDetails._id});


         if(!user){
            return res.status(404).send({
                status : "failed" , 
                message : "User not found"
            })
         }


         if(oldRefreshToken != userRefreshToken.token || userRefreshToken.blacklisted){
            return res.status(401).send({status : "failed" , message : "Unauthorized access"});
         }


         const {accessToken  , refreshToken , refreshTokenExp ,accessTokenExp } = await generateToken(user);


         return {
            newAccessToken : accessToken , 
            newRefreshToken : refreshToken , 
            newAccessTokenExp : accessTokenExp , 
            newRefreshTokenExp : refreshTokenExp
         }

     } catch (error) {
        console.log(error);
        res.status(500).json({
            status : "failed" , 
            message : "Internal server error"
        })
     }
}


export default refreshAccessToken