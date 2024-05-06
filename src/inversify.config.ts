import { Container } from 'inversify';
import controllerModule from './controllers/controller.module';
import serviceModule from './services/service.module';
import { InversifyExpressServer } from 'inversify-express-utils';
import bodyParser from 'body-parser';
import express from 'express';
import connectToDatabase from './db/mongo.config';
import middlewareModule from './middlewares/middleware.module';
import { loggerMiddleware } from '@utils';
import cors from 'cors';
import config from 'config';
// config
const corsUrl: string = config.get('URLS.BASE_URL');

const corsConfig = {
  origin: [corsUrl, 'http://localhost:4200'],
  credentials: true,
};

const app = express();

// Apply global middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(loggerMiddleware);
app.use(cors(corsConfig));

const container = new Container();

// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const server = new InversifyExpressServer(container, app, {
  rootPath: '/api',
});
container.load(serviceModule, middlewareModule, controllerModule);

server.setConfig(async () => {
  await connectToDatabase();
});

export { server, container };
