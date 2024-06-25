import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import companiesRouter from './routes/companies.router';
import { connectToDatabase } from './services/database.service';
import { notFoundMiddleware, errorMiddleware } from './middlewares/index';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

connectToDatabase()
  .then(() => {
    app.use('/resumes', companiesRouter);

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    app.listen(8080, () => {
      console.log('Server is runnin on port 8080.');
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit();
  });
