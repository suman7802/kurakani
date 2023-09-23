import {Router} from 'express';
import {likeController} from '../controllers/like.controller';

const likeRouter = Router();

likeRouter.post('/', likeController.addLike);
likeRouter.get('/', likeController.getLikes);

export {likeRouter};
