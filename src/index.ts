require('dotenv').config();
import express from 'express';
import helmet from 'helmet';
import * as parser from 'body-parser';
import {userRouter} from './routes/userRouter';
import {postRouter} from './routes/postRouter';
import {commentRouter} from './routes/commentRouter';

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(express.json());
app.use(parser.urlencoded({extended: true}));

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
