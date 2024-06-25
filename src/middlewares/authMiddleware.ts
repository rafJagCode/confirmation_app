import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['api-key'];

  dotenv.config();
  if (apiKey !== process.env.API_KEY) {
    return next({ code: 401, message: 'Missing api-key in headers.' });
  }

  next();
};

export default authMiddleware;
