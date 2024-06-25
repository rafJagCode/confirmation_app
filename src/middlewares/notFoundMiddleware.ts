import { Request, Response } from 'express';
import path from 'path';

const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).sendFile(path.join(__dirname, '../views/404.html'));
};

export default notFoundMiddleware;
