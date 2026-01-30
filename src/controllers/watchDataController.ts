import { Request, Response } from "express";
import { WatchData } from "../models/WatchData";
import { IUser, User } from "../models/User";

// POST /api/watch-data
export const uploadWatchData = async (req: Request, res: Response) => {
  try {
    const {
      serialNumber,
      heartRate,
      stepCount,
      longitude,
      latitude,
      batteryLevel,
    } = req.body;
    const recordedAudio = req.file ? req.file.buffer : null;

    const watchData = await WatchData.create({
      serialNumber,
      heartRate: heartRate ? Number(heartRate) : null,
      stepCount: stepCount ? Number(stepCount) : null,
      recordedAudio,
      longitude: longitude ? Number(longitude) : null,
      latitude: latitude ? Number(latitude) : null,
      batteryLevel: batteryLevel ? Number(batteryLevel) : null,
    });

    res.status(201).json({
      message: "Watch data saved successfully",
      id: watchData._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving watch data" });
  }
};

// GET /api/watch-data/:serialNumber
export const getWatchData = async (req: Request, res: Response) => {
  try {
    const { serialNumber } = req.params;
    const userId = (req as any).user.id;

    if (!serialNumber) {
      return res.status(400).json({ message: "Serial number is required" });
    }

    const user: IUser | null = await User.findById(userId);
    if (
      !user ||
      !user.serialNumbers ||
      !user.serialNumbers.includes(serialNumber)
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden - user does not own this watch" });
    }

    const lastDataInstance = await WatchData.findOne({ serialNumber }).sort({
      createdAt: -1,
    }); // Return latest data entry for the watch
    res.json(lastDataInstance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving watch data" });
  }
};
