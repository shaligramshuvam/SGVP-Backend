import { static as staticServe } from 'express';
import 'reflect-metadata';
import { container, server } from './inversify.config'; // add container for dev only
import { getRouteInfo } from 'inversify-express-utils';
import * as prettyjson from 'prettyjson';
import config from 'config';
import path from 'path';
import { initFirebase } from './utils/firebaseAdmin';
// import { getRouteInfo } from 'inversify-express-utils';

server.setErrorConfig((app) => {
  app.use(function (err, req, res, next) {
    err.status = 404;
    next(err);
  });
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.warn(err.message);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'Nodejs - Internal Error',
    });
  });
});

// Init firebase
initFirebase();

process
  .on('unhandledRejection', (reason, p) => {
    // Use your own logger here
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    // Use your own logger here
    console.error(err, 'Uncaught Exception thrown');

    // Optional: Ensure process will stop after this
    process.exit(1);
  });

const app = server.build();
const PORT = config.get('PORT') || 3000;
app.set('port', PORT);
app.use('/assets', staticServe(path.join(__dirname, './assets')));
// Uncommnent following for dev purpose

const routeInfo = getRouteInfo(container);
console.log(prettyjson.render({ routes: routeInfo.reverse() }));
app.listen(app.get('port'), () => {
  console.log('Running on http://localhost:' + app.get('port'));
});

// export the app instance
export default app;
