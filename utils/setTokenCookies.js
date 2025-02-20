// Token can be set with cookies in two ways 
// httpOnly - true 
// httpOnly - false 

// with httpOnly - true => we cannot access it on the frontend.
// with httpOnly - false => we can access it on the frontend but it is less secure.







async function setTokensCookies(res , accessToken , newAccessTokenExp , refreshToken , newRefreshTokenExp){

    const accessTokenMaxAge = (newAccessTokenExp - Math.floor(Date.now() / 1000 )) * 1000 ;

    const refreshTokenMaxAge = (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000 ;

    // set cookie for accessToken 

    res.cookie('accessToken' , accessToken , {
        httpOnly : true ,
        secure : true  ,
        maxAge : accessTokenMaxAge , 
        // sameSite : 'strict' , // Adjust according to your requirements
    })


     // set cookie for refreshToken 

     res.cookie('refreshToken' , refreshToken , {
        httpOnly : true ,
        secure : true  ,
        maxAge : refreshTokenMaxAge , 
        // sameSite : 'strict' , // Adjust according to your requirements
    })
}

export default setTokensCookies;