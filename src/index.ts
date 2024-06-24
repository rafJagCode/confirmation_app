import express from 'express';
import path from 'path';
import { connectToDatabase } from './services/database.service';
import companiesRouter from './routes/companies.router';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

connectToDatabase()
  .then(() => {
    app.use('/resumes', companiesRouter);

    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
    });

    app.listen(8080, () => {
      console.log('Server is runnin on port 8080.');
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit();
  });
