import { Module } from "../../decorators/module.decorator";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  services: [AuthService],
})
export class AuthModule {}