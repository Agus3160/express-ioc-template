import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../decorators/controller.decorator';
import { Get } from '../../decorators/method.decorator';
import { UserService } from './user.service';
import { successRes } from '../../lib/util';
import { SchemaValidation } from '../../decorators/zod-validation.decorator';
import { EmailSchema, IdSchema } from '../../lib/common/schema';
import { Inject } from '../../decorators/di.decorator';

@Controller('/user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get('/')
  public async getUsers(_req: Request, res: Response, _next: NextFunction) {
    const users = await this.userService.getAllUsers();
    successRes(res, { data: users, status: 200, message: 'Success' });
  }

  @Get('/:id')
  @SchemaValidation({ params: IdSchema })
  public async getUserById(req: Request, res: Response, _next: NextFunction) {
    const user = await this.userService.getUserById(
      parseInt(req.params.id, 10)
    );
    successRes(res, { data: user, status: 200, message: 'Success' });
  }

  @SchemaValidation({ params: EmailSchema })
  @Get('/email/:email')
  public async getUserByEmail(
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const user = await this.userService.getUserByEmail(req.params.email);
    successRes(res, { data: user, status: 200, message: 'Success' });
  }
}
