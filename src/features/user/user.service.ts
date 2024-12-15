import { Exception } from "../../core/exception";
import { PrismaService } from "../prisma.service";
import { UserEntity } from "./user.type";

export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers() {
    return await this.prismaService.user.findMany();
  }

  async getUserById(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if(!user) throw new Exception("User not found", 404);
    return user;
  }

  async getUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async mapUser(user:UserEntity){
    return {...user, roles: user.roles.map((role: any) => role.name)}
  }

}
