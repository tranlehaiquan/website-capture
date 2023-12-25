import { get, post, put } from "aws-amplify/api";

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
  format: string;
  recursiveCaptureId?: string;
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

export const createCaptureRecurring = async (
  data: CreateCaptureData
): Promise<any> => {
  const restOperation = post({
    apiName: "capture",
    path: "/recurring-capture",
    options: {
      body: data,
    },
  });

  const { body } = await restOperation.response;
  return body.json();
};

export const getCaptureList = async (where: any = {}): Promise<Capture[]> => {
  const search = new URLSearchParams(where);

  const { body } = await get({
    apiName: "capture",
    path: `/capture?${search.toString()}`,
  }).response;

  return (await body.json()) as Capture[];
};

export const getRecurringCaptureList = async (): Promise<any[]> => {
  const { body } = await get({
    apiName: "capture",
    path: "/recurring-capture",
  }).response;

  return (await body.json()) as any[];
};

export const getRecurringCaptureById = async (id: string): Promise<any> => {
  const { body } = await get({
    apiName: "capture",
    path: `/recurring-capture/${id}`,
  }).response;

  return (await body.json()) as any[];
};

export const updateRecurringCapture = async (data: any): Promise<any> => {
  const { body } = await put({
    apiName: "capture",
    path: `/recurring-capture`,
    options: {
      body: data,
    }
  }).response;

  return (await body.json()) as any[];
}