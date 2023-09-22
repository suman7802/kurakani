import {Router} from 'express';
const userRouter = Router();

import {getCreateUser} from '../models/user';

userRouter.post('/login', getCreateUser);
export {userRouter};
