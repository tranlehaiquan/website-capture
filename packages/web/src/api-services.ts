import { get, post } from "aws-amplify/api";

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

export const getCapture = async (
  captureId: string,
  preSigned = true
): Promise<Capture> => {
  const restOperation = get({
    apiName: "capture",
    path: `/capture/${captureId}?preSigned=${!!preSigned}`,
  });

  const { body } = await restOperation.response;
  return (await body.json()) as Capture;
};

type CreateCaptureData = {
  uri: string;
  width: number;
  height: number;
  format: string;
};

export const createCapture = async (data: CreateCaptureData): Promise<any> => {
  const restOperation = post({
    apiName: "capture",
    path: "/capture",
    options: {
      body: data,
    },
  });

  const { body } = await restOperation.response;
  return body.json();
};

export const getCaptureList = async (): Promise<Capture[]> => {
  const { body } = await get({
    apiName: "capture",
    path: "/capture",
  }).response;

  return (await body.json()) as Capture[];
};
