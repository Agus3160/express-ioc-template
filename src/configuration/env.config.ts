import { z } from "zod";
import { config } from "dotenv";

config();

const node_env = ["development", "production", "test"] as const;
const logger_level = ["debug", "info", "warn", "error"] as const;

export const EnvSchema = z.object({
  // App
  NODE_ENV: z.enum(node_env).default("development"),
  PORT: z.coerce.number().default(3000),

  // Jwt
  JWT_SECRET: z.string().default("secret"),
  JWT_EXPIRATION_TIME: z.coerce.number().default(86400000),

  // Logger
  LOGGER_LEVEL: z.enum(logger_level).default("info"),

  // Cors
  CORS_ORIGIN: z
    .string()
    .transform((value) => value.split(","))
    .default("*"),

});

export type EnvType = z.infer<typeof EnvSchema>;

export const envValues = EnvSchema.parse(process.env);
