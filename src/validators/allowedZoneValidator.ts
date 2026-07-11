import { z } from "zod";

export const addZoneSchema = z.object({
  serialNumber: z.string().min(1),
  zoneName: z.string().min(1),
  centerLat: z.preprocess((v) => Number(v), z.number()),
  centerLng: z.preprocess((v) => Number(v), z.number()),
  radiusMeters: z.preprocess((v) => Number(v), z.number()),
});

export const serialNumberParamSchema = z.object({
  serialNumber: z.string().min(1),
});

export const zoneIdParamSchema = z.object({
  zoneId: z.string().min(1),
});
