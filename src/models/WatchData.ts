import { Schema, model, Document } from "mongoose";

export interface IWatchData extends Document {
  serialNumber: string;
  heartRate: number | null;
  stepCount: number | null;
  recordedAudio: Buffer | null;
  longitude: number | null;
  latitude: number | null;
  batteryLevel: number | null;
  createdAt: Date;
  updatedAt: Date;
}
const WatchDataSchema = new Schema<IWatchData>(
  {
    serialNumber: { type: String, required: true, index: true },
    heartRate: { type: Number, required: false },
    stepCount: { type: Number, required: false },
    recordedAudio: { type: Buffer, required: false },
    longitude: { type: Number, required: false },
    latitude: { type: Number, required: false },
    batteryLevel: { type: Number, required: false },
  },
  { timestamps: true },
);

export const WatchData = model<IWatchData>("WatchData", WatchDataSchema);
