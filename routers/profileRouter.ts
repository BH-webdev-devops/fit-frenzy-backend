import { Router } from 'express';
import { addProfile, getProfile, updateProfile } from '../controllers/profileController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';


const profileRouter = Router();
profileRouter.get('/profile', authenticateJWT, getProfile);
profileRouter.post('/profile', authenticateJWT, addProfile);
profileRouter.put('/profile', authenticateJWT, updateProfile);

export default profileRouter;