import {Router} from 'express';
const userRouter = Router();
import { userController } from '../controllers/user.controller';

userRouter.post('/otp', userController.user);

export {userRouter};
