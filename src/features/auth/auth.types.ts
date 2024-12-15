import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(6),
});
export type SignUp = z.infer<typeof SignUpSchema>;

export const SignInSchema = SignUpSchema.omit({ username: true });
export type SignIn = z.infer<typeof SignInSchema>;
