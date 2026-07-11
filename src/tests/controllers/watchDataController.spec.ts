import { getWatchData } from "../../controllers/watchDataController";

jest.mock("../../models/User", () => ({
  User: {
    findById: jest.fn(),
  },
}));

jest.mock("../../models/WatchData", () => ({
  WatchData: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

import { User } from "../../models/User";
import { WatchData } from "../../models/WatchData";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as any;
};

describe("watchDataController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("getWatchData validates serialNumber and returns 400", async () => {
    const req: any = { params: {}, user: { id: "u1" } };
    const res = mockResponse();
    await getWatchData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getWatchData forbids when user doesn't own watch", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["x"] });
    const req: any = { params: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await getWatchData(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("getWatchData returns latest data when authorized", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    const last = { _id: "w1", serialNumber: "s1" };
    (WatchData.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(last),
    });
    const req: any = { params: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await getWatchData(req, res);
    expect(WatchData.findOne).toHaveBeenCalledWith({ serialNumber: "s1" });
    expect(res.json).toHaveBeenCalledWith(last);
  });
});
