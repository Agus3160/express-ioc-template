import { z } from "zod";
import { BaseModel } from "../../lib/types";
import { Role } from "@prisma/client";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(5),
  email: z.string().email(),
  roles: z.string().array()
})
export type User = z.infer<typeof UserSchema>

export type UserEntity = BaseModel & {
  id: number;
  username: string;
  email: string;
  roles: Role[]
}