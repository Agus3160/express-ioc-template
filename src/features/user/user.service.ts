import { Exception } from '../../core/exception';
import { Inject, Injectable } from '../../decorators/di.decorator';
import { PrismaService } from '../prisma.service';
import { UserEntity } from './user.type';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private readonly db: PrismaService) {}

  async getAllUsers() {
    return await this.db.user.findMany();
  }

  async getUserById(id: number) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) throw new Exception('User not found', 404);
    return user;
  }

  async getUserByEmail(email: string) {
    return await this.db.user.findUnique({ where: { email } });
  }

  async mapUser(user: UserEntity) {
    return { ...user, roles: user.roles.map((role: any) => role.name) };
  }
}
