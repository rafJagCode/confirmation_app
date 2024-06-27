import { Request, Response } from 'express';

const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).render('error', {
    code: 404,
    message: 'The page you requested could not be found.',
  });
};

export default notFoundMiddleware;
