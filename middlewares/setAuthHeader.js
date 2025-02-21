import isTokenExpired from "../utils/isTokenExpired.js";

const setAuthHeader = async (req , res , next) => {
    try {
       
       const accessToken = req.cookies.accessToken ;
       const isExpired = isTokenExpired(accessToken);
      
       if(accessToken || !isExpired){
          // set the header with authorization bearer value 
           console.log("yes")
           req.headers['authorization'] = `Bearer ${accessToken}`;
       }

       next()

    } catch (error) {
        console.error('Error adding access token to header:' , error.message);
    }
}

export default setAuthHeader ;