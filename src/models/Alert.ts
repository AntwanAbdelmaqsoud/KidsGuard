import { Schema, model, Document } from "mongoose";

export interface IAlert extends Document {
  serialNumber: string;
  userId: string;
  dataId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    serialNumber: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    dataId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Alert = model<IAlert>("Alert", AlertSchema);
