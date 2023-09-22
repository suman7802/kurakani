import {Router} from 'express';
import {postController} from '../controllers/post.controller';

const postRouter = Router();

postRouter.post('/', postController.addPost);
postRouter.post('/unique', postController.getPost);
postRouter.get('/all/public', postController.getAllPublicPost);
postRouter.get('/all', postController.getAllPost);
postRouter.put('/', postController.updatePost);
postRouter.delete('/', postController.deletePost);

export {postRouter};
