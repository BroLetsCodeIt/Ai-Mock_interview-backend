import { Router } from "express";
import userController from "../controllers/userController.js";
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";

const router = Router() ;


// public routes 

router.post('/register',userController.userRegistration);
router.post('/verify-email',userController.VerifyEmail);
router.post('/login' , userController.userLogin);
router.post('/refresh-token' , userController.getNewAccessToken);

router.post('/forget-password',userController.sendUserPasswordResetEmail);
router.post('/reset-password-confirm/:id/:token', userController.userPasswordReset);

// protected routes 

router.get('/profile' ,accessTokenAutoRefresh, passport.authenticate('jwt' , {session : false}) , userController.userProfile);

router.post('/change-password' , accessTokenAutoRefresh , passport.authenticate('jwt' ,{session : false}) , userController.changePassword);

router.post('/logout' , accessTokenAutoRefresh  , passport.authenticate('jwt' , {session: false}) , 
userController.userLogout);


export default router; 