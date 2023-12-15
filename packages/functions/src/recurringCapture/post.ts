import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import * as yup from "yup";

import { connectDB } from "../data-source";
import { RecursiveCapture } from "@website-capture/core/entity/RecursiveCapture";
import { getUserFromEvent } from "@website-capture/core/utils";
import { dayOfMonth, dayOfWeek, hours, minutes } from "src/schemaValidation";
import {
  SUPPORT_IMAGE_FORMATS,
  SUPPORT_SCHEDULE,
} from "@website-capture/core/constants";

// Minutes: 0-59
// Hours: 0-23
// Days of week: 1-7
// Day of month: 1-31

// Daily -> Minutes, Hours
// Weekly -> Minutes, Hours, Day of week
// Monthly -> Minutes, Hours, Day of Month

const bodySchema = yup.object().shape({
  uri: yup.string().required(),
  height: yup.number().required(),
  width: yup.number().required(),
  format: yup.mixed().oneOf(SUPPORT_IMAGE_FORMATS).default("jpg"),
  schedule: yup.mixed().oneOf(SUPPORT_SCHEDULE).required(),
  scheduleOptions: yup
    .object()
    .when("schedule", {
      is: (schedule: string) => schedule === "daily",
      then: (schema) =>
        schema.shape({
          minutes: minutes.required(),
          hours: hours.required(),
        }),
      otherwise: (schema) => schema.optional(),
    })
    .when("schedule", {
      is: (schedule: string) => schedule === "weekly",
      then: (schema) =>
        schema.shape({
          minutes: minutes.required(),
          hours: hours.required(),
          dayOfWeek: dayOfWeek.required(),
        }),
      otherwise: (schema) => schema.optional(),
    })
    .when("schedule", {
      is: (schedule: string) => schedule === "monthly",
      then: (schema) =>
        schema.shape({
          minutes: minutes.required(),
          hours: hours.required(),
          dayOfMonth: dayOfMonth.required(),
        }),
      otherwise: (schema) => schema.optional(),
    }),
  scheduleEndTime: yup.date().required(),
});

/**
 * New Capture with input bodySchema
 * This handle will be called when you make a POST request to /recurring-capture
 */
export const handler = ApiHandler(async (event) => {
  await connectDB(Config.POSTGRES_URL);
  const user = await getUserFromEvent(event);

  // get body from event
  const bodyParsed = JSON.parse(event.body || "{}");

  // validate body
  try {
    const body = await bodySchema.validate(bodyParsed);

    const { uri, schedule, scheduleOptions } = bodyParsed;

    // console.log("schedule", schedule, scheduleOptions);
    // create RecursiveCapture
    const recursiveCapture = new RecursiveCapture();
    recursiveCapture.website = uri;
    recursiveCapture.width = body.width;
    recursiveCapture.height = body.height;
    recursiveCapture.format = body.format as any;
    recursiveCapture.schedule = schedule;
    recursiveCapture.scheduleOptions = scheduleOptions;
    if (user) {
      recursiveCapture.owner = user;
    }
    await recursiveCapture.save();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: recursiveCapture.id,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
});
