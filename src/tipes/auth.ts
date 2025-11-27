import z from "zod"

export const AuthRequest = z.object({
    username: z.string().min(5, "Username required"),
    password: z.string().min(5, "Password required")
})

export type AuthRequest = z.infer<typeof AuthRequest>

export const BaseToken = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

export type BaseToken = z.infer<typeof BaseToken>

export type JwtToken = {
  sub: string;
  exp: number;
  iat: number;
  type: string;
};

export type JwtUserToken = JwtToken & {
  name: string;
  email: string;
  role: string;
};

export const LoginToken = BaseToken.extend({
    refresh_token: z.string()
})

export type LoginToken = z.infer<typeof LoginToken>

export const LoginSchema= z.object({
    username: z.string().min(5, "Username required"),
    password: z.string().min(5, "Password required")
})

export type LoginSchema = z.infer<typeof LoginSchema>