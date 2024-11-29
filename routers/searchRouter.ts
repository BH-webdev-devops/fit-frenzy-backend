// routes.ts
import { Router } from 'express';
import { searchGymVideos } from '../controllers/searchController'

const searchRouter = Router();

searchRouter.get('/search', searchGymVideos);

export default searchRouter;