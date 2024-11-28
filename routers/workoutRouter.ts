import { Router } from 'express';
import { addWorkout, getWorkout, updateWorkout } from '../controllers/workoutController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const workoutRouter = Router();
workoutRouter.get('/workout', authenticateJWT, getWorkout);
workoutRouter.post('/workout', authenticateJWT, addWorkout);
workoutRouter.put('/workout', authenticateJWT, updateWorkout);

export default workoutRouter;
