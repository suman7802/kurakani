import {Router} from 'express';
import {userController} from '../controllers/user.controller';

const userRouter = Router();
userRouter.post('/otp', userController.user);
userRouter.get('/logout', userController.logout);

export {userRouter};
