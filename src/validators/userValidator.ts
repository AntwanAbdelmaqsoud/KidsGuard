import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    photoUrl: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.photoUrl !== undefined, {
    message: "At least one of name or photoUrl must be provided",
  });
