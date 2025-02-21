// This middleware will set Authorization Header and will refresh access token on expire.

import isTokenExpired from "../utils/isTokenExpired.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import setTokensCookies from "../utils/setTokenCookies.js";

// if we use this middleware we won't have to explicitly make request to refresh-token api url 

const accessTokenAutoRefresh = async (req , res , next) => {
    
   
    try {
        
        const accessToken = req.cookies.accessToken ;
        const isExpired = isTokenExpired(accessToken);
       
        if(accessToken || !isExpired){
           // set the header with authorization bearer value 
            req.headers['authorization'] = `Bearer ${accessToken}`;
        }

        if(!accessToken || isExpired){

            // Attempt to get the accessToken using new Refresh Token


            const refreshToken = req.cookies.refreshToken ;

            if(!refreshToken){
                throw new Error('Refresh token is missing')
            }

            // create the new refreshToken

            const { newAccessToken , newRefreshToken , newAccessTokenExp , newRefreshTokenExp } = await refreshAccessToken(req ,res)


            setTokensCookies(res , newAccessToken , newAccessTokenExp , newRefreshToken , newRefreshTokenExp)

            // Add the access token to the Authorization header 
            req.headers['authorization'] = `Bearer ${newAccessToken}`;
        }

        next();
 
    } catch (error) {
        res.status(401).json({error : "Unauthorized" , message : "Access token is missing  or invalid"});
    }
}

export default accessTokenAutoRefresh ;