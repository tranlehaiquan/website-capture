import React from "react";
import clsx from "clsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
});

const CaptureInput: React.FC<Props> = ({ className, onSubmit, disabled }) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      width: 1280,
      height: 1024,
      format: "jpg",
    },
    disabled,
  });

  return (
    <div className={clsx(className, "shadow")}>
      <input
        className="p-2 border border-gray-200 block w-full rounded-tl rounded-tr"
        placeholder="Enter website URL"
        {...form.register("uri")}
      />

      {form.formState.errors.uri && (
        <span className="text-red-500 text-sm">
          {form.formState.errors.uri.message}
        </span>
      )}

      <div className="grid grid-cols-3 p-4 border">
        <div>
          <p>Width:</p>
          <input
            type="number"
            className="border p-1 rounded"
            {...form.register("width")}
          />
        </div>
        <div>
          <p>Height:</p>
          <input
            type="number"
            className="border p-1 rounded"
            {...form.register("height")}
          />
        </div>
        <div>
          <p>Format:</p>
          {/* jpg, png, webp */}
          <select
            className="w-full border p-1 rounded"
            {...form.register("format")}
          >
            <option value="jpg">jpg</option>
            <option value="png">png</option>
            <option value="webp">webp</option>
          </select>
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
  );
};

export default CaptureInput;
