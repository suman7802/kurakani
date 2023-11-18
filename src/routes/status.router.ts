import {Router} from 'express';
import {Request, Response} from 'express';

const statusRouter = Router();
statusRouter.get('/dashboard', (req: Request, res: Response) => {
  res.json({
    status: 'Dashboard',
  });
});

export {statusRouter};
