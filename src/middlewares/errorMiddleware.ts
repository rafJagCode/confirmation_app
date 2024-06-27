import { ErrorRequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err.code) {
    return res
      .status(err.code)
      .render('error', { code: err.code, message: err.message });
  }

  return res.status(500).render('error', {
    code: 500,
    message:
      'Something went wrong. Whatever happened, it was probably our fault. Please try again later.',
  });
};

export default errorMiddleware;
