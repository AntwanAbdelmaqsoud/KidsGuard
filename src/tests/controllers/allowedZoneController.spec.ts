import {
  addZone,
  listZones,
  removeZone,
} from "../../controllers/allowedZoneController";

jest.mock("../../models/User", () => ({
  User: {
    findById: jest.fn(),
  },
}));

jest.mock("../../models/AllowedZone", () => ({
  AllowedZone: {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

import { User } from "../../models/User";
import { AllowedZone } from "../../models/AllowedZone";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as any;
};

describe("allowedZoneController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("addZone validates serialNumber and returns 400 when missing", async () => {
    const req: any = { body: {}, user: { id: "u1" } };
    const res = mockResponse();
    await addZone(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("addZone forbids when user doesn't own watch", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      serialNumbers: ["other"],
    });
    const req: any = {
      body: {
        serialNumber: "s1",
        zoneName: "z",
        centerLat: 1,
        centerLng: 1,
        radiusMeters: 10,
      },
      user: { id: "u1" },
    };
    const res = mockResponse();
    await addZone(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("addZone creates and returns 201 when valid", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    const created = { _id: "z1" };
    (AllowedZone.create as jest.Mock).mockResolvedValue(created);
    const req: any = {
      body: {
        serialNumber: "s1",
        zoneName: "z",
        centerLat: 1,
        centerLng: 1,
        radiusMeters: 10,
      },
      user: { id: "u1" },
    };
    const res = mockResponse();
    await addZone(req, res);
    expect(AllowedZone.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it("listZones returns 400 if no serialNumber param", async () => {
    const req: any = { params: {}, user: { id: "u1" } };
    const res = mockResponse();
    await listZones(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("listZones forbids when user doesn't own watch", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      serialNumbers: ["other"],
    });
    const req: any = { params: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await listZones(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("listZones returns zones when authorized", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    const zones = [{ _id: "z1" }];
    (AllowedZone.find as jest.Mock).mockResolvedValue(zones);
    const req: any = { params: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await listZones(req, res);
    expect(AllowedZone.find).toHaveBeenCalledWith({ serialNumber: "s1" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(zones);
  });

  it("removeZone validates zoneId and deletes", async () => {
    (AllowedZone.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    const req: any = { params: { zoneId: "z1" } };
    const res = mockResponse();
    await removeZone(req, res);
    expect(AllowedZone.findByIdAndDelete).toHaveBeenCalledWith("z1");
    expect(res.status).toHaveBeenCalledWith(204);
  });
});
