import setupServer from './index';

setupServer()
  .then((app) => {
    app.listen(8080, () => {
      console.log('Server is runnin on port 8080.');
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit();
  });
