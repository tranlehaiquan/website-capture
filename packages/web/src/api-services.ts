import { API } from "aws-amplify";

type Capture = {
  createdAt: string;
  updatedAt: string;
  id: string;
  website: string;
  imagePath: string;
  status: string;
  preSignedUrl?: string;
  height: number;
  width: number;
};

export const getCapture = (
  captureId: string,
  preSigned = true
): Promise<Capture> => {
  return API.get(
    "capture",
    `/capture/${captureId}?preSigned=${!!preSigned}`,
    {}
  );
};

type CreateCaptureData = {
  uri: string;
  width: number;
  height: number;
  format: string;
};

export const createCapture = (data: CreateCaptureData) => {
  return API.post("capture", "/capture", {
    body: data,
  });
};

export const getCaptureList = (): Promise<Capture[]> => {
  return API.get("capture", "/capture", {});
};
