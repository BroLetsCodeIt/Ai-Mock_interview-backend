import jwt from 'jsonwebtoken';

function isTokenExpired(token){
    
    if(!token) return true ;


    // 1st method - Decode and check Expiry

    /*
    
    try {

    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if(decodedPayload < currentTime) return true ;
        else return false;
    } catch (error) {
        console.log("Invalid token format" , error);
        return true;
    }
    
    
    */





    // 2nd method - jwt 

    try {
        
        const decodedToken = jwt.decode(token);
        const currentTime = Math.floor(Date.now() / 10000);

       return decodedToken.exp < currentTime ;

    } catch (error) {
        console.log("Invalid token format" , error);
        return true;
    }



}


export default isTokenExpired; 