import "reflect-metadata";
import { ApplicationFactory } from "./core/application.factory";
import { PrismaService } from "./features/prisma.service";
import { ZodValidation } from "./middleware/zod.middleware";
import { ErrorHandler } from "./middleware/exception.middleware";
import { UserModule } from "./features/user/user.module";
import { AuthModule } from "./features/auth/auth.module";
import { JwtService } from "./features/jwt/jwt.service";
import { AuthMiddleware } from "./features/auth/auth.middleware";
import { TestModule } from "./features/test/test.module";
import { corsOptions } from "./configuration/cors.config";
import { ReqLoggerMiddleware } from "./middleware/req-logger.middleware";
import cors from "cors";

const bootstrap = () =>
  ApplicationFactory.run(
    {
      modules: [UserModule, AuthModule, TestModule],
      middlewares: [ZodValidation, AuthMiddleware, ReqLoggerMiddleware],
      providers: [PrismaService, JwtService],
    },
    (app) => {
      app.setGlobalExceptionHandler(ErrorHandler);
      app.use(cors(corsOptions));
      const loggerMiddleware = app.get(ReqLoggerMiddleware);
      app.use(loggerMiddleware.use);
    }
  );

bootstrap();
