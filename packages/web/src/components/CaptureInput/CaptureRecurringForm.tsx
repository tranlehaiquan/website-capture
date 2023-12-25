import React from "react";
import clsx from "clsx";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Format, validationRecurringSchema, Schedule } from "shared";
import DateTime from "../DateTime";

export type CaptureInputValues = yup.InferType<
  typeof validationRecurringSchema
>;

interface Props {
  className?: string;
  onSubmit?: (data: any) => void;
  disabled?: boolean;
  value?: CaptureInputValues;
  submitText?: string;
}

const RecurringCaptureForm: React.FC<Props> = ({
  className,
  onSubmit,
  disabled,
  value,
  submitText = "Capture",
}) => {
  const form = useForm({
    resolver: yupResolver(validationRecurringSchema) as any,
    defaultValues: {
      ...value,
      width: value?.width ?? 1280,
      height: value?.height ?? 1024,
      format: value?.format ?? Format.jpeg,
    },
    disabled,
  });

  return (
    <div className={clsx(className)}>
      <div className="shadow">
        <input
          className="p-2 border border-gray-200 block w-full"
          placeholder="Enter website URL"
          {...form.register("website")}
        />

        {form.formState.errors.website && (
          <span className="text-red-500 text-sm">
            {form.formState.errors.website.message}
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
                <Controller
                  name="endTime"
                  control={form.control}
                  render={({ field }) => (
                    <DateTime
                      className="input input-bordered"
                      value={field.value?.toString()}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
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
        </div>

        {/* Submit button */}
        <button
          className="block w-full bg-blue-500 text-white p-2 rounded-bl rounded-br"
          onClick={form.handleSubmit(onSubmit || console.log)}
          disabled={form.formState.isSubmitting || disabled}
        >
          {submitText}
        </button>
      </div>
    </div>
  );
};

export default RecurringCaptureForm;
