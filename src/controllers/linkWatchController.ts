import { Request, Response } from "express";
import { IUser, User } from "../models/User";

// link watch to the requesting user
export const linkWatchToUser = async (req: Request, res: Response) => {
  const { serialNumber } = req.body as { serialNumber: string };
  const userId = (req as any).user.id;

  if (!serialNumber) {
    return res.status(400).json({ message: "Serial number is required" });
  }

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.serialNumbers && user.serialNumbers.includes(serialNumber)) {
      return res
        .status(409)
        .json({ message: "Watch already linked to this user" });
    }

    user.serialNumbers = user.serialNumbers || [];
    user.serialNumbers.push(serialNumber);
    await user.save();

    return res.status(200).json({
      message: "Watch linked successfully",
      serialNumbers: user.serialNumbers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to link watch", error });
  }
};
