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
export const SUPPORT_IMAGE_FORMATS = [Format.png, Format.jpeg, Format.webp];

export enum Schedule {
  "daily" = "daily",
  "weekly" = "weekly",
  "monthly" = "monthly",
}

export const SUPPORT_SCHEDULE = [Schedule.daily, Schedule.weekly, Schedule.monthly];

export enum CAPTURE_TYPES {
  "One Time" = "one-time",
  "Recurring" = "recurring",
}