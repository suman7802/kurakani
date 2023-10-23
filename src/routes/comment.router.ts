import {Router} from 'express';
import {commentController} from '../controllers/comment.controller';

const commentRouter = Router();

commentRouter.post('/reply', commentController.CreateCommentReply);
commentRouter.post('/', commentController.addComment);
commentRouter.get('/', commentController.getComments);
commentRouter.put('/', commentController.updateComment);
commentRouter.delete('/', commentController.deleteComment);

export {commentRouter};
