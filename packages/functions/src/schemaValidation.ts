import * as yup from "yup";

// minutes from 0 to 59
export const minutes = yup.number().min(0).max(59);
export const hours = yup.number().min(0).max(23);
export const dayOfWeek = yup.number().min(1).max(7);
export const dayOfMonth = yup.number().min(1).max(31);

