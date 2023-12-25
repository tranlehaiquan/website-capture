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
  Schedule,
  validationRecurringSchema,
} from "shared";
import middy from "@middy/core";
import {
  baseMiddlewares,
  connectDatabase,
  validator,
} from "@website-capture/core/middlewares";

const schedulerClient = new SchedulerClient({});

const bodySchema = yup.object().shape({
  body: validationRecurringSchema,
});

const postHandler = async (event: any) => {
  const user = await getUserFromEvent(event);
  const { body } = await bodySchema.cast(event);

  const { website, schedule, minutes, hours, dayOfMonth, dayOfWeek } = body;

  // create RecursiveCapture
  const recursiveCapture = new RecursiveCapture();
  recursiveCapture.website = website;
  recursiveCapture.width = body.width;
  recursiveCapture.height = body.height;
  recursiveCapture.format = body.format as any;
  recursiveCapture.schedule = schedule as string;
  recursiveCapture.minutes = minutes;
  recursiveCapture.hours = hours;
  recursiveCapture.dayOfMonth = dayOfMonth;
  recursiveCapture.dayOfWeek = dayOfWeek;
  recursiveCapture.endTime = body.endTime;
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
        Input: JSON.stringify({
          recursiveCaptureId: recursiveCapture.id,
        }),
      },
      FlexibleTimeWindow: {
        Mode: "OFF",
        MaximumWindowInMinutes: undefined,
      },
    };
  }

  if (schedule === Schedule.weekly) {
    createScheduleCommand = {
      Name: name,
      ScheduleExpression: `cron(${minutes} ${hours} ? * ${dayOfWeek} *)`,
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
