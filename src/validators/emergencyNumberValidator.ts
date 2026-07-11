import { z } from "zod";

export const emergencyNumberBodySchema = z.object({
  emergencyNumber: z.string().min(1),
});

export const serialNumberParamSchema = z.object({
  serialNumber: z.string().min(1),
});
