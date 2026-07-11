import { z } from "zod";

export const uploadWatchDataSchema = z.object({
  serialNumber: z.string().min(1),
  heartRate: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  stepCount: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  latitude: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  longitude: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
  batteryLevel: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().optional(),
  ),
});
