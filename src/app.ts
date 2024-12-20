import 'reflect-metadata';
import { ApplicationFactory } from './core/application.factory';
import { ExceptionHandler } from './middleware/exception.middleware';
import { corsOptions } from './configuration/cors.config';
import { ReqLoggerMiddleware } from './middleware/req-logger.middleware';
import { ReqIdMiddleware } from './middleware/req-id.middleware';
import { LoggerService } from './features/logger.service';
import { json, urlencoded } from 'express';
import { EnvService } from './features/env.service';
import cors from 'cors';
import { ControllerModule } from './modules/controllers';
import { MiddlewareModule } from './modules/middlewares';
import { ProviderModule } from './modules/providers';

const bootstrap = () => {
  const app = ApplicationFactory.run({
    controllers: ControllerModule,
    middlewares: MiddlewareModule,
    providers: ProviderModule,
  });

  // Get providers instance
  const logger = app.get(LoggerService);
  const env = app.get(EnvService);

  // Get the PORT from env values
  const PORT = env.get('PORT');

  // Set Custom Exception Handler
  app.setGlobalExceptionHandler(ExceptionHandler);

  // Set Handlers & Middlewares
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use(ReqIdMiddleware);
  app.use(ReqLoggerMiddleware);

  // Start the server
  app.start(PORT, () => logger.info(`Server running on port ${PORT}`));
};

bootstrap();
