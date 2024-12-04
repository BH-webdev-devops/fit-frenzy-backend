import { Router } from 'express';
import { addWorkout, getWorkout, updateWorkout, filterByDate, fetchActivities, deleteWorkout, fetchAllWorkouts } from '../controllers/workoutController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const workoutRouter = Router();
workoutRouter.get('/workout', authenticateJWT, getWorkout);
workoutRouter.get('/workout/all', authenticateJWT, fetchAllWorkouts);
workoutRouter.post('/workout', authenticateJWT, addWorkout);
workoutRouter.put('/workout/:id', authenticateJWT, updateWorkout);
workoutRouter.get('/workout/filter', authenticateJWT, filterByDate);
workoutRouter.get('/workout/activity', authenticateJWT, fetchActivities);
workoutRouter.delete('/workout/:id', authenticateJWT, deleteWorkout);

export default workoutRouter;
