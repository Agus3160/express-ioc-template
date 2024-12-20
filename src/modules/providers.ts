import { AuthService } from '../features/auth/auth.service';
import { EnvService } from '../features/env.service';
import { JwtService } from '../features/jwt/jwt.service';
import { LoggerService } from '../features/logger.service';
import { PrismaService } from '../features/prisma.service';
import { UserService } from '../features/user/user.service';

export const ProviderModule = [
  JwtService,
  LoggerService,
  PrismaService,
  EnvService,
  AuthService,
  UserService,
];
