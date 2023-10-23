require('dotenv').config();
import express, {Application, Request, Response} from 'express';
import helmet from 'helmet';
import * as parser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';

import './types/custom';
import {authenticate} from './routes/authenticate.router';
import {userRouter} from './routes/user.router';
import {postRouter} from './routes/post.router';
import {likeRouter} from './routes/like.router';
import {commentRouter} from './routes/comment.router';
import {authentication} from './middleware/authentication';
import {errorHandler} from './controllers/errorHandler.controller';

const app: Application = express();
const port = process.env.PORT;

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(parser.urlencoded({extended: true}));
app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

authenticate(app, passport);
app.use('/api/user', userRouter);
app.use('/api/post', authentication, postRouter);
app.use('/api/like', authentication, likeRouter);
app.use('/api/comment', authentication, commentRouter);
app.get('/dashboard', (req: Request, res: Response) => {
  res.json({
    status: 'successfully login',
  });
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
