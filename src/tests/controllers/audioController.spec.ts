import {
  getAudioBySerialNumber,
  getAudioFileById,
} from "../../controllers/audioController";

jest.mock("../../models/RecordedAudio", () => ({
  RecordedAudio: {
    findOne: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("../../models/User", () => ({
  User: {
    findById: jest.fn(),
  },
}));

import { RecordedAudio } from "../../models/RecordedAudio";
import { User } from "../../models/User";

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  res.send = jest.fn();
  return res as any;
};

describe("audioController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("getAudioBySerialNumber validates input and returns 400", async () => {
    const req: any = { params: {}, user: { id: "u1" } };
    const res = mockResponse();
    await getAudioBySerialNumber(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getAudioBySerialNumber forbids when user doesn't own watch", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["x"] });
    const req: any = { params: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await getAudioBySerialNumber(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("getAudioBySerialNumber returns data when authorized", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    const audio = { _id: "a1" };
    (RecordedAudio.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(audio),
    });
    const req: any = { params: { serialNumber: "s1" }, user: { id: "u1" } };
    const res = mockResponse();
    await getAudioBySerialNumber(req, res);
    expect(res.json).toHaveBeenCalledWith(audio);
  });

  it("getAudioFileById validates audioId and returns 400", async () => {
    const req: any = { params: {}, user: { id: "u1" } };
    const res = mockResponse();
    await getAudioFileById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getAudioFileById returns 404 when record not found", async () => {
    (RecordedAudio.findById as jest.Mock).mockResolvedValue(null);
    const req: any = { params: { audioId: "a1" }, user: { id: "u1" } };
    const res = mockResponse();
    await getAudioFileById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getAudioFileById forbids when user lacks access", async () => {
    const record: any = {
      serialNumber: "s1",
      recordedAudio: Buffer.from([1, 2, 3]),
    };
    (RecordedAudio.findById as jest.Mock).mockResolvedValue(record);
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["x"] });
    const req: any = { params: { audioId: "a1" }, user: { id: "u1" } };
    const res = mockResponse();
    await getAudioFileById(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("getAudioFileById sends audio when authorized", async () => {
    const record: any = {
      serialNumber: "s1",
      recordedAudio: Buffer.from([1, 2, 3]),
    };
    (RecordedAudio.findById as jest.Mock).mockResolvedValue(record);
    (User.findById as jest.Mock).mockResolvedValue({ serialNumbers: ["s1"] });
    const req: any = { params: { audioId: "a1" }, user: { id: "u1" } };
    const res = mockResponse();
    await getAudioFileById(req, res);
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "audio/wav");
    expect(res.send).toHaveBeenCalledWith(record.recordedAudio);
  });
});
