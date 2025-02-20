import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router() ;


// public routes 

router.post('/register',userController.userRegistration);
router.post('/verify-email',userController.VerifyEmail);
router.post('/login' , userController.userLogin);
router.post('/refresh-token' , userController.getNewAccessToken)


export default router; 