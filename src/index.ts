import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import companiesRouter from './routes/companies.router';
import { connectToDatabase } from './services/database.service';
import { notFoundMiddleware, errorMiddleware } from './middlewares/index';

const setupServer = async () => {
  const app = express();

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.json());
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  await connectToDatabase();

  app.use('/resumes', companiesRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

export default setupServer;
