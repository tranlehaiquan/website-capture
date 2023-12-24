import React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Format, validationOneTimeSchema } from "shared";

export type CaptureInputValues = {
  website: string;
  height: number;
  width: number;
  format: Format;
};

interface Props {
  className?: string;
  onSubmit?: (data: any) => void;
  disabled?: boolean;
  value?: CaptureInputValues;
}

const RecurringOneTimeForm: React.FC<Props> = ({
  className,
  onSubmit,
  disabled,
  value,
}) => {
  const form = useForm({
    defaultValues: {
      ...value,
      width: value?.width ?? 1280,
      height: value?.height ?? 1024,
      format: value?.format ?? Format.jpeg,
    },
    resolver: yupResolver(validationOneTimeSchema) as any,
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

export default RecurringOneTimeForm;
