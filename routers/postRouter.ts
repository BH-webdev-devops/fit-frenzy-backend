import { Router } from 'express';
import { addPost, addReply, getPosts, getReplies, deleteReply, deletePost, updatePost } from '../controllers/postController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const postRouter = Router();
postRouter.post('/posts', authenticateJWT, addPost);
postRouter.get('/posts', authenticateJWT, getPosts);
postRouter.put('/posts/:id', authenticateJWT, updatePost);
postRouter.delete('/posts/:id', authenticateJWT, deletePost);
postRouter.post('/posts/:id/reply', authenticateJWT, addReply);
postRouter.get('/posts/:id/reply', authenticateJWT, getReplies);
postRouter.delete('/posts/:id/reply/:replyId', authenticateJWT, deleteReply);

export default postRouter;