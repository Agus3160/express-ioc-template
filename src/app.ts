import 'reflect-metadata';
import { ApplicationFactory } from './core/application.factory';
import { PrismaService } from './features/prisma.service';
import { ZodValidation } from './middleware/zod.middleware';
import { ExceptionHandler } from './middleware/exception.middleware';
import { JwtService } from './features/jwt/jwt.service';
import { AuthMiddleware } from './features/auth/auth.middleware';
import { corsOptions } from './configuration/cors.config';
import { ReqLoggerMiddleware } from './middleware/req-logger.middleware';
import { UserController } from './features/user/user.controller';
import { UserService } from './features/user/user.service';
import { AuthService } from './features/auth/auth.service';
import { AuthController } from './features/auth/auth.controller';
import { ReqIdMiddleware } from './middleware/req-id.middleware';
import { LoggerService } from './features/logger.service';
import { json, urlencoded } from 'express';
import { EnvService } from './features/env.service';
import cors from 'cors';

const bootstrap = () => {
  const app = ApplicationFactory.run({
    controllers: [UserController, AuthController],
    middlewares: [ZodValidation, AuthMiddleware, ReqLoggerMiddleware, ReqIdMiddleware],
    providers: [PrismaService, JwtService, EnvService, LoggerService, UserService, AuthService],
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
