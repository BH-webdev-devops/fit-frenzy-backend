import { Router } from 'express';
import { checkIfAdmin, getAllUsers, getUserById, deleteUser } from '../controllers/adminController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const adminRouter = Router();
adminRouter.get('/admin/check', authenticateJWT, checkIfAdmin);
adminRouter.get('/admin/users', authenticateJWT, checkIfAdmin, getAllUsers);
adminRouter.get('/admin/users/:id', authenticateJWT, checkIfAdmin, getUserById);
adminRouter.delete('/admin/users/:id', authenticateJWT, checkIfAdmin, deleteUser);

export default adminRouter;