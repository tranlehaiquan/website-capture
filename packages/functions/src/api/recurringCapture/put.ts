import middy from "@middy/core";
import { RecursiveCapture } from "@website-capture/core/entity/RecursiveCapture";
import {
  baseMiddlewares,
  connectDatabase,
  validator,
} from "@website-capture/core/middlewares";
import { getUserFromEvent } from "@website-capture/core/utils";
import { Schedule, validationRecurringSchema } from "shared";
import { Config } from "sst/node/config";
import * as yup from "yup";
import {
  SchedulerClient,
  UpdateScheduleCommand,
  type UpdateScheduleCommandInput,
} from "@aws-sdk/client-scheduler";
import createError from "http-errors";

const schedulerClient = new SchedulerClient({});

const bodySchema = yup.object().shape({
  body: validationRecurringSchema,
});

// PUT /recurring-capture/{id}
const putHandler = async (event: any) => {
  const body = event.body;
  // current user
  const user = await getUserFromEvent(event);

  if (!user) {
    throw createError.Unauthorized();
  }

  const recurringCapture = await RecursiveCapture.findOne({
    where: {
      id: body.id,
      ownerId: user.id,
    },
  });

  if (!recurringCapture) {
    throw createError.NotFound();
  }

  const recurring = await RecursiveCapture.update(
    {
      id: body.id,
      ownerId: user.id,
    },
    body
  );

  // TODO: refactor this and POST /recurring-capture 
  const {
    schedule = recurringCapture.schedule,
    minutes = recurringCapture.minutes,
    hours = recurringCapture.hours,
    dayOfMonth = recurringCapture.dayOfMonth,
    dayOfWeek = recurringCapture.dayOfWeek,
  } = body;
  let name = `Recurring capture ${recurringCapture.id}`;
  // replace character not [0-9a-zA-Z-_.] with -
  name = name.replaceAll(/[^0-9a-zA-Z-_.]/g, "-");
  const GroupName = process.env.GROUP_NAME;
  let updateScheduleCommand: UpdateScheduleCommandInput | undefined;

  if (schedule === Schedule.daily) {
    updateScheduleCommand = {
      Name: name,
      ScheduleExpression: `cron(${minutes} ${hours} * * ? *)`,
      Description: `RecurringId: ${recurringCapture.id}`,
      Target: {
        // Target
        Arn: process.env.TARGET_ARN, // required
        RoleArn: process.env.TARGET_ROLE_ARN,
        RetryPolicy: {
          MaximumRetryAttempts: 3,
        },
        Input: JSON.stringify({
          recursiveCaptureId: recurringCapture.id,
        }),
      },
      FlexibleTimeWindow: {
        Mode: "OFF",
        MaximumWindowInMinutes: undefined,
      },
    };
  }

  if (schedule === Schedule.weekly) {
    updateScheduleCommand = {
      Name: name,
      ScheduleExpression: `cron(${minutes} ${hours} ? * ${dayOfWeek} *)`,
      Target: {
        // Target
        Arn: process.env.TARGET_ARN, // required
        RoleArn: process.env.TARGET_ROLE_ARN,
        RetryPolicy: {
          MaximumRetryAttempts: 3,
        },
        Input: JSON.stringify(recurringCapture),
      },
      FlexibleTimeWindow: {
        Mode: "OFF",
        MaximumWindowInMinutes: undefined,
      },
    };
  }

  if (schedule === Schedule.monthly) {
    updateScheduleCommand = {
      Name: name,
      ScheduleExpression: `cron(${minutes} ${hours} ${dayOfMonth} * ? *)`,
      Target: {
        // Target
        Arn: process.env.TARGET_ARN, // required
        RoleArn: process.env.TARGET_ROLE_ARN,
        RetryPolicy: {
          MaximumRetryAttempts: 3,
        },
        Input: JSON.stringify(recurringCapture),
      },
      FlexibleTimeWindow: {
        Mode: "OFF",
        MaximumWindowInMinutes: undefined,
      },
    };
  }

  if (updateScheduleCommand) {
    const command = new UpdateScheduleCommand({
      ...updateScheduleCommand,
      GroupName: GroupName,
    });
    await schedulerClient.send(command);
  }

  return recurring;
};

export const handler = middy(putHandler).use([
  ...baseMiddlewares,
  validator({
    schema: bodySchema,
  }),
  connectDatabase(Config.POSTGRES_URL),
]);
