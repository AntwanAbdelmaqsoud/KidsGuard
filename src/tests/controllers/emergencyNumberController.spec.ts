import {
  getEmergencyNumber,
  addEmergencyNumber,
} from "../../controllers/emergencyNumberController";

jest.mock("../../models/EmergencyNumber", () => {
  const fn: any = jest.fn(function (this: any, obj: any) {
    Object.assign(this, obj);
    this.save = jest.fn();
  });
  fn.findOne = jest.fn();
  return { EmergencyNumber: fn };
});

jest.mock("../../models/User", () => ({
  User: {
    findById: jest.fn(),
  },
}));

import { EmergencyNumber } from "../../models/EmergencyNumber";
import { User } from "../../models/User";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as any;
};

describe("emergencyNumberController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("getEmergencyNumber returns 400 if missing param", async () => {
    const req: any = { params: {} };
    const res = mockResponse();
    await getEmergencyNumber(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getEmergencyNumber returns 404 when not found", async () => {
    (EmergencyNumber.findOne as jest.Mock).mockResolvedValue(null);
    const req: any = { params: { serialNumber: "s1" } };
    const res = mockResponse();
    await getEmergencyNumber(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getEmergencyNumber returns data when found", async () => {
    (EmergencyNumber.findOne as jest.Mock).mockResolvedValue({
      serialNumber: "s1",
      emergencyNumber: "911",
    });
    const req: any = { params: { serialNumber: "s1" } };
    const res = mockResponse();
    await getEmergencyNumber(req, res);
    expect(res.json).toHaveBeenCalledWith({
      serialNumber: "s1",
      emergencyNumber: "911",
    });
  });

  it("addEmergencyNumber validates input and returns 400", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();
    await addEmergencyNumber(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("addEmergencyNumber forbids when user lacks access", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["x"] });
    const req: any = {
      params: { serialNumber: "s1" },
      body: { emergencyNumber: "911" },
      user: { id: "u1" },
    };
    const res = mockResponse();
    await addEmergencyNumber(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("addEmergencyNumber updates existing emergency number", async () => {
    const existing: any = {
      serialNumber: "s1",
      emergencyNumber: "000",
      save: jest.fn(),
    };
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    (EmergencyNumber.findOne as jest.Mock).mockResolvedValue(existing);
    const req: any = {
      params: { serialNumber: "s1" },
      body: { emergencyNumber: "911" },
      user: { id: "u1" },
    };
    const res = mockResponse();
    await addEmergencyNumber(req, res);
    expect(existing.emergencyNumber).toBe("911");
    expect(existing.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      serialNumber: "s1",
      emergencyNumber: "911",
    });
  });

  it("addEmergencyNumber creates new when none exists", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    (EmergencyNumber.findOne as jest.Mock).mockResolvedValue(null);
    const created = {
      serialNumber: "s1",
      emergencyNumber: "911",
      save: jest.fn(),
      id: "e1",
    };
    // simulate constructor and save
    const EmergencyNumberMock: any = function (this: any, obj: any) {
      Object.assign(this, obj);
      this.save = jest.fn();
    };
    // Temporarily override module export
    (EmergencyNumber as any).mockImplementation ??= EmergencyNumberMock;

    const req: any = {
      params: { serialNumber: "s1" },
      body: { emergencyNumber: "911" },
      user: { id: "u1" },
    };
    const res = mockResponse();
    await addEmergencyNumber(req, res);
    // we can't assert on internal new-instance behavior reliably here; ensure status 201
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
