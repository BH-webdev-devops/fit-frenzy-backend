import { Router } from 'express';
import { addProfile, getProfile, updateUserDetails } from '../controllers/profileController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';
import { upload } from '../middlewares/uploadFiles';
import { getWeightEntries } from '../utils/helpers';


const profileRouter = Router();
profileRouter.get('/profile/weight', authenticateJWT, getWeightEntries);
profileRouter.get('/profile', authenticateJWT, getProfile);
profileRouter.post('/profile', upload.single('image'), authenticateJWT, addProfile);
profileRouter.put('/profile', authenticateJWT, updateUserDetails);



export default profileRouter;