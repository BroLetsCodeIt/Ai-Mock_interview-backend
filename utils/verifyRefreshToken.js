import jwt from 'jsonwebtoken';
import userRefreshTokenModel from '../models/UserRefreshToken.js';

const verifyRefreshToken = async (oldrefreshtoken) => {

    try {
        const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY ;
    
        // verify refresh token is available in database or not 

        const userRefreshToken = await userRefreshTokenModel.findOne({token : oldrefreshtoken});

        // if refresh token not found , reject with an error 
        if(!userRefreshToken){
            throw {error : true , message : "Invalid Refresh Token"};
        }

        const tokenDetails = jwt.verify(oldrefreshtoken , privateKey);

        // IF verification successfully , resolve with token details 

        return {  tokenDetails , error : false , message : "Valid Refresh Token" }

    } catch (error) {
        // if any error occurs during verification or token not found 
        throw { error : true , message : "Invalid Refresh Token"};
    }
      
}


export default verifyRefreshToken ;