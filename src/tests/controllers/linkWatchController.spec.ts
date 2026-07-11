import { linkWatchToUser } from "../../controllers/linkWatchController";

jest.mock("../../models/User", () => ({
  User: {
    findById: jest.fn(),
  },
}));

import { User } from "../../models/User";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as any;
};

describe("linkWatchController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 400 when missing serialNumber", async () => {
    const req: any = { body: {}, user: { id: "u1" } };
    const res = mockResponse();
    await linkWatchToUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);
    const req: any = { body: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await linkWatchToUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 409 when watch already linked", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    const req: any = { body: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await linkWatchToUser(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("links watch and returns 200", async () => {
    const userObj: any = { serialNumbers: [], save: jest.fn() };
    (User.findById as jest.Mock).mockResolvedValue(userObj);
    const req: any = { body: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await linkWatchToUser(req, res);
    expect(userObj.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ serialNumbers: ["s1"] }),
    );
  });
});
