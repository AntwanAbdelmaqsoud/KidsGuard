import { z } from "zod";

export const linkWatchSchema = z.object({
  serialNumber: z.string().min(1),
});
