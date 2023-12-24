import {
  CAPTURE_TYPES,
  Format,
  SUPPORT_IMAGE_FORMATS,
  SUPPORT_SCHEDULE,
  Schedule,
} from "./constants";
import * as yup from "yup";

// minutes from 0 to 59
export const minutes = yup.number().min(0).max(59);
export const hours = yup.number().min(0).max(23);
export const dayOfWeek = yup.number().min(1).max(7);
export const dayOfMonth = yup.number().min(1).max(31);

export const validationRecurringSchema = yup.object().shape({
  website: yup.string().required(),
  height: yup.number().required(),
  width: yup.number().required(),
  format: yup.mixed().oneOf(SUPPORT_IMAGE_FORMATS).default(Format.jpeg),
  schedule: yup.mixed().oneOf(SUPPORT_SCHEDULE).required(),
  minutes: minutes.when("captureType", {
    is: (type: string) => type === CAPTURE_TYPES.Recurring,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  hours: hours.when("captureType", {
    is: (type: string) => type === CAPTURE_TYPES.Recurring,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  dayOfMonth: yup.number().when("schedule", {
    is: (schedule: string) => schedule === Schedule.monthly,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  dayOfWeek: yup.number().when("schedule", {
    is: (schedule: string) => schedule === Schedule.weekly,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  endTime: yup.date().required(),
});

export const validationOneTimeSchema = yup.object().shape({
  website: yup.string().required(),
  height: yup.number().required(),
  width: yup.number().required(),
  format: yup.mixed().oneOf(SUPPORT_IMAGE_FORMATS).default(Format.jpeg),
});
