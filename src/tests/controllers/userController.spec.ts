import {
  getCurrentUserInfo,
  updateUserInformation,
  deleteUserAccount,
  getUserNotifications,
} from "../../controllers/userController";

jest.mock("../../models/User", () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("../../models/UserAlert", () => ({
  UserAlert: {
    find: jest.fn(),
  },
}));

import { User } from "../../models/User";
import { UserAlert } from "../../models/UserAlert";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res as any;
};

describe("userController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getCurrentUserInfo returns 401 when user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);
    const req: any = { user: { id: "u1" } };
    const res = mockResponse();
    await getCurrentUserInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
  });

  it("getCurrentUserInfo returns user data when found", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      email: "a@b.com",
      name: "A",
      photoUrl: "p",
      serialNumbers: ["s1"],
      role: "user",
    });
    const req: any = { user: { id: "u1" } };
    const res = mockResponse();
    await getCurrentUserInfo(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ email: "a@b.com", name: "A" }),
      }),
    );
  });

  it("updateUserInformation validates input and returns 400 when no fields", async () => {
    const req: any = { user: { id: "u1" }, body: {} };
    const res = mockResponse();
    await updateUserInformation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No fields to update" });
  });

  it("updateUserInformation updates and returns 200", async () => {
    const updated = { email: "x@x.com" };
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
    const req: any = { user: { id: "u1" }, body: { name: "New" } };
    const res = mockResponse();
    await updateUserInformation(req, res);
    expect(User.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User information updated",
        user: updated,
      }),
    );
  });

  it("deleteUserAccount deletes and clears cookie", async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    const req: any = { user: { id: "u1" } };
    const res = mockResponse();
    await deleteUserAccount(req, res);
    expect(User.findByIdAndDelete).toHaveBeenCalledWith("u1");
    expect(res.clearCookie).toHaveBeenCalledWith(
      "refreshToken",
      expect.any(Object),
    );
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("getUserNotifications returns notifications", async () => {
    const chain: any = {
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      then: undefined,
      exec: jest.fn().mockResolvedValue([{ _id: "n1" }]),
    };
    (UserAlert.find as jest.Mock).mockReturnValue({
      sort: () => ({
        populate: () => ({
          populate: () => Promise.resolve([{ _id: "n1" }]),
        }),
      }),
    });

    const req: any = { user: { id: "u1" } };
    const res = mockResponse();
    await getUserNotifications(req, res);
    expect(UserAlert.find).toHaveBeenCalledWith({ recipientUserId: "u1" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ notifications: [{ _id: "n1" }] });
  });
});
