import 'reflect-metadata';
import { ApplicationFactory } from './core/application.factory';
import { PrismaService } from './features/prisma.service';
import { ZodValidation } from './middleware/zod.middleware';
import { ExceptionHandler } from './middleware/exception.middleware';
import { JwtService } from './features/jwt/jwt.service';
import { AuthMiddleware } from './features/auth/auth.middleware';
import { corsOptions } from './configuration/cors.config';
import { ReqLoggerMiddleware } from './middleware/req-logger.middleware';
import cors from 'cors';
import { UserController } from './features/user/user.controller';
import { UserService } from './features/user/user.service';
import { AuthService } from './features/auth/auth.service';
import { AuthController } from './features/auth/auth.controller';

const bootstrap = () => {
  const app = ApplicationFactory.run({
    controllers: [UserController, AuthController],
    middlewares: [ZodValidation, AuthMiddleware, ReqLoggerMiddleware],
    providers: [PrismaService, JwtService, UserService, AuthService],
  });
  app.setGlobalExceptionHandler(ExceptionHandler);
  app.use(cors(corsOptions));
  app.use(ReqLoggerMiddleware);
  app.start(8000, () => console.log('INIT'));
};

bootstrap();
