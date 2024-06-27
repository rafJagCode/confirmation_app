import dotenv from 'dotenv';
import setupServer from './index';

setupServer()
  .then((app) => {
    dotenv.config();
    const port =
      process.env.ENV === 'PROD' ? process.env.PROD_PORT : process.env.DEV_PORT;
    app.listen(port, () => {
      console.log(`Server is runnin on port ${port}.`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit();
  });
