export enum Status {
  "inProcess" = "inProcess",
  "successful" = "successful",
  "failed" = "failed",
  "deleted" = "deleted",
  "expired" = "expired",
}

export enum Format {
  "png" = "png",
  "jpeg" = "jpeg",
  "webp" = "webp",
}

// format in array
export const SUPPORT_IMAGE_FORMATS = Object.values(Format);

export enum Schedule {
  "daily" = "daily",
  "weekly" = "weekly",
  "monthly" = "monthly",
}

export const SUPPORT_SCHEDULE = Object.values(Schedule);