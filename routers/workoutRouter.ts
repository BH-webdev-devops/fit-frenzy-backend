import { Router } from 'express';
import { addWorkout, getWorkout, updateWorkout, filterByDate } from '../controllers/workoutController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const workoutRouter = Router();
workoutRouter.get('/workout', authenticateJWT, getWorkout);
workoutRouter.post('/workout', authenticateJWT, addWorkout);
workoutRouter.put('/workout', authenticateJWT, updateWorkout);
workoutRouter.get('/workout/filter', authenticateJWT, filterByDate);

export default workoutRouter;
