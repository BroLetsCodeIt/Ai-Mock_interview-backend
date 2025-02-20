import jwt from 'jsonwebtoken';
import userRefreshTokenModel from '../models/UserRefreshToken.js';

// console.log(Math.floor(Date.now() / 1000) + 100) 
// console.log(jwt);

// {
//     decode: [Function (anonymous)],
//     verify: [Function (anonymous)],
//     sign: [Function (anonymous)],
//     JsonWebTokenError: [Function: JsonWebTokenError],
//     NotBeforeError: [Function: NotBeforeError],
//     TokenExpiredError: [Function: TokenExpiredError]
//  }


async function generateToken(user) {

    try {
        
      const payload = {_id : user._id , roles : user.roles} ;

      // accessToken
      // accessTokenExpiration
      const accessTokenExp = Math.floor(Date.now() / 1000 ) + 100 ; // set expiration to 100sec from now 

      const accessToken = jwt.sign(
        {
            ...payload , 
            exp : accessTokenExp
        },
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY
        // {expiresIn : '10s'}
    )


      // Generate Refresh Token with expires time 
      // expiresTime
      const refreshTokenExp = Math.floor(Date.now() / 1000 ) + 60 * 60 * 24 * 5 ; // expires in 5 days 
     
      const refreshToken = jwt.sign({
        ...payload , exp : refreshTokenExp
      },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    )


    const userRefreshToken = await userRefreshTokenModel.findOneAndDelete({userId : user._id});

    // if(userRefreshToken){
    //     await userRefreshToken.remove();
    // }

    // if want to blacklist rather than remove then use below code 
    // if(userRefreshToken){
    //     userRefreshToken.blacklisted = true ;
    //     await userRefreshToken.save();
    // }

    await new userRefreshTokenModel({userId : user._id , token : refreshToken}).save();
    
    return Promise.resolve({accessToken , accessTokenExp , refreshToken , refreshTokenExp});

    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }



}


export default generateToken;

