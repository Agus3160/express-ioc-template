import { Module } from "../../decorators/module.decorator";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  services: [UserService]
})
export class UserModule{}