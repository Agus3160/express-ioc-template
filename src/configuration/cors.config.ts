import { CorsOptions } from 'cors';
import { envValues } from './env.config';

const origin = envValues.CORS_ORIGIN;

export const corsOptions: CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: origin,
  credentials: true,
};
