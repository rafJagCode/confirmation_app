import express from 'express';
import dotenv from 'dotenv';
import vhost from 'vhost';
import setupServer from './index';

setupServer()
  .then((app) => {
    let port: string;
    let subdomain: null | string;

    dotenv.config();
    if (process.env.ENV === 'PROD') {
      port = process.env.PROD_PORT;
    } else {
      port = process.env.DEV_PORT;
    }

    if (process.env.USE_SUBDOMAIN === 'true') {
      subdomain = process.env.SUBDOMAIN;
      app = express().use(vhost(subdomain, app));
    }

    app.listen(port, () => {
      console.log(
        `Server is runnin on port ${port}${subdomain ? ' using subdomain ' + subdomain : ''}.`
      );
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit();
  });
