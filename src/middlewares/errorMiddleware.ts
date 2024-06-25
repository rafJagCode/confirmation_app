import { ErrorRequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err.code) {
    return res.status(err.code).json({ message: err.message, code: err.code });
  }

  return res.status(500).json({ message: err.message, code: 500 });
};

export default errorMiddleware;
