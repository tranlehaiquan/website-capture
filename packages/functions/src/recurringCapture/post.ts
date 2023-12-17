import { Config } from "sst/node/config";
import * as yup from "yup";
import {
  SchedulerClient,
  CreateScheduleCommand,
  type CreateScheduleCommandInput,
} from "@aws-sdk/client-scheduler";

import { RecursiveCapture } from "@website-capture/core/entity/RecursiveCapture";
import { getUserFromEvent } from "@website-capture/core/utils";
import {
  dayOfMonth,
  dayOfWeek,
  hours,
  minutes,
} from "@website-capture/core/schemaValidation";
import {
  SUPPORT_IMAGE_FORMATS,
  SUPPORT_SCHEDULE,
  Schedule,
} from "@website-capture/core/constants";
import middy from "@middy/core";
import {
  baseMiddlewares,
  connectDatabase,
  validator,
} from "@website-capture/core/middlewares";

const schedulerClient = new SchedulerClient({});

// Minutes: 0-59
// Hours: 0-23
// Days of week: 1-7
// Day of month: 1-31

// Daily -> Minutes, Hours
// Weekly -> Minutes, Hours, Day of week
// Monthly -> Minutes, Hours, Day of Month
const bodySchema = yup.object().shape({
  body: yup.object().shape({
    uri: yup.string().required(),
    height: yup.number().required(),
    width: yup.number().required(),
    format: yup.mixed().oneOf(SUPPORT_IMAGE_FORMATS).default("jpg"),
    schedule: yup.mixed().oneOf(SUPPORT_SCHEDULE).required(),
    scheduleOptions: yup
      .object()
      .when("schedule", {
        is: (schedule: string) => schedule === Schedule.daily,
        then: (schema) =>
          schema.shape({
            minutes: minutes.required(),
            hours: hours.required(),
          }),
        otherwise: (schema) => schema.optional(),
      })
      .when("schedule", {
        is: (schedule: string) => schedule === Schedule.weekly,
        then: (schema) =>
          schema.shape({
            minutes: minutes.required(),
            hours: hours.required(),
            dayOfWeek: dayOfWeek.required(),
          }),
        otherwise: (schema) => schema.optional(),
      })
      .when("schedule", {
        is: (schedule: string) => schedule === Schedule.monthly,
        then: (schema) =>
          schema.shape({
            minutes: minutes.required(),
            hours: hours.required(),
            dayOfMonth: dayOfMonth.required(),
          }),
        otherwise: (schema) => schema.optional(),
      }),
    scheduleEndTime: yup.date().required(),
  }),
});

/**
 * New Capture with input bodySchema
 * This handle will be called when you make a POST request to /recurring-capture
 */
const postHandler = async (event: any) => {
  const user = await getUserFromEvent(event);
  const { body } = await bodySchema.cast(event);

  const { uri, schedule, scheduleOptions } = body;

  // console.log("schedule", schedule, scheduleOptions);
  // create RecursiveCapture
  const recursiveCapture = new RecursiveCapture();
  recursiveCapture.website = uri;
  recursiveCapture.width = body.width;
  recursiveCapture.height = body.height;
  recursiveCapture.format = body.format as any;
  recursiveCapture.schedule = schedule as string;
  recursiveCapture.scheduleOptions = scheduleOptions;
  if (user) {
    recursiveCapture.owner = user;
  }
  await recursiveCapture.save();

  let createScheduleCommand: CreateScheduleCommandInput | undefined;
  let name = `Recurring capture ${recursiveCapture.id}`;
  // replace character not [0-9a-zA-Z-_.] with -
  name = name.replaceAll(/[^0-9a-zA-Z-_.]/g, "-");
  const GroupName = process.env.GROUP_NAME;

  if (schedule === Schedule.daily) {
    const { minutes, hours } = scheduleOptions as {
      minutes: number;
      hours: number;
    };

    createScheduleCommand = {
      Name: name,
      ScheduleExpression: `cron(${minutes} ${hours} * * ? *)`,
      Description: `RecurringId: ${recursiveCapture.id}`,
      Target: {
        // Target
        Arn: process.env.TARGET_ARN, // required
        RoleArn: process.env.TARGET_ROLE_ARN,
        RetryPolicy: {
          MaximumRetryAttempts: 3,
        },
        Input: JSON.stringify(recursiveCapture),
      },
      FlexibleTimeWindow: {
        Mode: "OFF",
        MaximumWindowInMinutes: undefined,
      },
    };
  }

  if (schedule === Schedule.weekly) {
    const { minutes, hours, daysOfWeek } = scheduleOptions as {
      minutes: number;
      hours: number;
      daysOfWeek: number;
    };

    createScheduleCommand = {
      Name: name,
      ScheduleExpression: `cron(${minutes} ${hours} ? * ${daysOfWeek} *)`,
      Target: {
        // Target
        Arn: process.env.TARGET_ARN, // required
        RoleArn: process.env.TARGET_ROLE_ARN,
        RetryPolicy: {
          MaximumRetryAttempts: 3,
        },
        Input: JSON.stringify(recursiveCapture),
      },
      FlexibleTimeWindow: {
        Mode: "OFF",
        MaximumWindowInMinutes: undefined,
      },
    };
  }

  if (schedule === Schedule.monthly) {
    const { minutes, hours, dayOfMonth } = scheduleOptions as {
      minutes: number;
      hours: number;
      dayOfMonth: number;
    };

    createScheduleCommand = {
      Name: name,
      ScheduleExpression: `cron(${minutes} ${hours} ${dayOfMonth} * ? *)`,
      Target: {
        // Target
        Arn: process.env.TARGET_ARN, // required
        RoleArn: process.env.TARGET_ROLE_ARN,
        RetryPolicy: {
          MaximumRetryAttempts: 3,
        },
        Input: JSON.stringify(recursiveCapture),
      },
      FlexibleTimeWindow: {
        Mode: "OFF",
        MaximumWindowInMinutes: undefined,
      },
    };
  }

  if (createScheduleCommand) {
    const command = new CreateScheduleCommand({
      ...createScheduleCommand,
      GroupName,
    });
    const schedulerInstance = await schedulerClient.send(command);

    recursiveCapture.scheduleArn = schedulerInstance.ScheduleArn as string;
    await recursiveCapture.save()
  }

  return recursiveCapture;
};

export const handler = middy(postHandler).use([
  ...baseMiddlewares,
  validator({
    schema: bodySchema,
  }),
  connectDatabase(Config.POSTGRES_URL),
]);
