import { Exception } from "../../core/exception";
import { Inject, Injectable } from "../../decorators/di.decorator";
import { JwtService } from "../jwt/jwt.service";
import { PrismaService } from "../prisma.service";
import { SignIn, SignUp } from "./auth.types";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async signup(data: SignUp): Promise<void> {
    const hash = bcrypt.hashSync(data.password, 10);
    await this.prismaService.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hash,
        roles: {
          connectOrCreate: {
            where: { name: "USER" },
            create: { name: "USER" },
          },
        },
      },
    });
  }

  async signin(data: SignIn): Promise<string> {
    const { email, password } = data;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new Exception("User not found", 404);
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new Exception("Invalid credentials", 401);
    const token = this.jwtService.genToken({ id: user.id });
    return token;
  }

}
