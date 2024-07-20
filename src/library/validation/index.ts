import { z } from "zod";

export const signUpValidation = z.object({
  name: z.string().min(2, { message: "user name is to short" }),
  username: z.string().min(2, { message: "user name is to short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "possword must contain more than 8 characters." }),
});

export const signInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "possword must contain more than 8 characters." }),
});
