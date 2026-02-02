import { Request, Response } from "express";
import { RecordedAudio } from "../models/RecordedAudio";
import { User } from "../models/User";

export async function getAudioBySerialNumber(req: Request, res: Response) {
  try {
    const { serialNumber } = req.params;
    const userId = (req as any).user.id;

    if (!serialNumber) {
      return res.status(400).json({ message: "Serial number is required" });
    }
    const user = await User.findById(userId);
    if (
      !user ||
      !user.serialNumbers ||
      !user.serialNumbers.includes(serialNumber)
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden - user does not own this watch" });
    }

    const audioData = await RecordedAudio.findOne({ serialNumber }).sort({
      createdAt: -1,
    });
    res.json(audioData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving audio data" });
  }
}
