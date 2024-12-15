import { CorsOptions } from "cors";
import { EnvService } from "../features/env.service";

const origin = EnvService.get("CORS_ORIGIN");

export const corsOptions:CorsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: origin,
  credentials: true
}