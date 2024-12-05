import { Router } from 'express';
import { registerUser, loginUser, forgotPassword } from '../controllers/authController';
import { checkUserData, checkIfUserExist } from '../middlewares/checkUser';

const authRouter = Router();
authRouter.post('/register', checkUserData(true), checkIfUserExist(false), registerUser);
authRouter.post('/login', checkUserData(false), checkIfUserExist(true), loginUser);
authRouter.post('/forgot-password', forgotPassword);

export default authRouter;