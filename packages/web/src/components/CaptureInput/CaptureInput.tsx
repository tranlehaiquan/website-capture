import React from "react";
import clsx from "clsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Format, SUPPORT_SCHEDULE, Schedule, CAPTURE_TYPES } from "shared";

interface Props {
  className?: string;
  onSubmit?: (data: any) => void;
  disabled?: boolean;
}

const schema = yup.object().shape({
  uri: yup.string().url("URL must be validate").required("URL can't be empty"),
  width: yup.number().required().positive().integer(),
  height: yup.number().required().positive().integer(),
  format: yup.string().required(),
  captureType: yup.string().required(),
  schedule: yup.mixed().oneOf(SUPPORT_SCHEDULE),
  // minutes
  minutes: yup.number().when("captureType", {
    is: (type: string) => type === CAPTURE_TYPES.Recurring,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  hours: yup.number().when("captureType", {
    is: (type: string) => type === CAPTURE_TYPES.Recurring,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  dayOfMonth: yup.number(),
  dayOfWeek: yup.number(),
  scheduleEndTime: yup.date().when("captureType", {
    is: (type: string) => type === CAPTURE_TYPES.Recurring,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// type of schema
export type CaptureInputValues = yup.InferType<typeof schema>;

const CaptureInput: React.FC<Props> = ({ className, onSubmit, disabled }) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      width: 1280,
      height: 1024,
      format: Format.jpeg,
      captureType: CAPTURE_TYPES["One Time"],
    },
    disabled,
  });

  return (
    <div className={clsx(className)}>
      <div role="tablist" className="tabs tabs-boxed">
        {/* loop to CAPTURE_TYPES */}
        {Object.keys(CAPTURE_TYPES).map((key) => (
          <a
            key={key}
            role="tab"
            className={clsx("tab", {
              "tab-active":
                form.watch("captureType") ===
                CAPTURE_TYPES[key as keyof typeof CAPTURE_TYPES],
            })}
            onClick={() =>
              form.setValue(
                "captureType",
                CAPTURE_TYPES[key as keyof typeof CAPTURE_TYPES]
              )
            }
          >
            {key}
          </a>
        ))}
      </div>

      <div className="shadow">
        <input
          className="p-2 border border-t-0 border-gray-200 block w-full"
          placeholder="Enter website URL"
          {...form.register("uri")}
        />

        {form.formState.errors.uri && (
          <span className="text-red-500 text-sm">
            {form.formState.errors.uri.message}
          </span>
        )}
        <div className="p-4 border">
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <p>Width:</p>
              <input
                type="range"
                min={0}
                max="10000"
                className="range"
                step="20"
                {...form.register("width")}
              />

              <input
                type="number"
                className="border p-1 rounded w-full"
                value={form.watch("width")}
                disabled
              />
            </div>
            <div>
              <p>Height:</p>
              <input
                type="range"
                min={0}
                max="10000"
                className="range"
                step="20"
                {...form.register("height")}
              />
              <input
                type="number"
                className="border p-1 rounded w-full"
                value={form.watch("height")}
                disabled
              />
            </div>
            <div>
              <p>Format:</p>
              <select
                className="select select-bordered w-full max-w-xs"
                {...form.register("format")}
              >
                {Object.keys(Format).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.watch("captureType") === CAPTURE_TYPES.Recurring && (
            <div className="mt-4">
              {/* Schedule type selector Schedule */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p>Schedule type:</p>
                  <select
                    className="select select-bordered w-full"
                    {...form.register("schedule")}
                  >
                    {Object.keys(Schedule).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                {/* scheduleEndTime */}
                <div>
                  <p>Schedule end time:</p>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    {...form.register("scheduleEndTime")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {form.watch("schedule") === Schedule.monthly && (
                  <div>
                    <p>Day of month:</p>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      {...form.register("dayOfMonth")}
                    >
                      {Array.from(Array(31).keys()).map((i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {form.watch("schedule") === Schedule.weekly && (
                  <div>
                    <p>Day of week:</p>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      {...form.register("dayOfWeek")}
                    >
                      {Array.from(Array(7).keys()).map((i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {/* Schedule hours */}
                <div>
                  <p>Hours:</p>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    {...form.register("hours")}
                  >
                    {Array.from(Array(24).keys()).map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Schedule minutes input text */}
                <div>
                  <p>Minutes:</p>
                  {/* <input type="number" className="input input-bordered w-full max-w-xs" /> */}
                  <select
                    className="select select-bordered w-full max-w-xs"
                    {...form.register("minutes")}
                  >
                    {Array.from(Array(60).keys()).map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          className="block w-full bg-blue-500 text-white p-2 rounded-bl rounded-br"
          onClick={form.handleSubmit(onSubmit || console.log)}
          disabled={form.formState.isSubmitting || disabled}
        >
          Capture
        </button>
      </div>
    </div>
  );
};

export default CaptureInput;
