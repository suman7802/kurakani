require('dotenv').config();
import express, {Application} from 'express';
import helmet from 'helmet';
import * as parser from 'body-parser';
import {authenticate} from './routes/authenticate';
import {postRouter} from './routes/postRouter';
import {commentRouter} from './routes/commentRouter';
import passport from 'passport';
import session from 'express-session';

const app: Application = express();
const port = process.env.PORT;

app.use(helmet());
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
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

app.get('/dashboard', (req, res) => {
  res.json({
    status: 'successfully login',
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
