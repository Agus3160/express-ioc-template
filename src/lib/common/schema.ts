import { z } from "zod";

export const IdSchema = z.object({ id: z.coerce.number().int().positive() });
export const EmailSchema = z.object({ email: z.string().email() });
