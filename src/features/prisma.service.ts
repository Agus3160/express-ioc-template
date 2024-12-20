import { PrismaClient } from '@prisma/client';
import { Injectable } from '../decorators/di.decorator';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}
