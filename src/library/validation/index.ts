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

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "caption must have more than 5 characters" })
    .max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(3).max(100),
  tags: z.string(),
});

export const UpdateProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(1, { message: "name is too short" }),
  username: z.string().min(1, { message: "username is too short" }),
  email: z.string().email(),
  bio: z.string(),
});
