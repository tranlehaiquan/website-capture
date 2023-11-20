import React from "react";

interface Props {
  className?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(({
  label,
  placeholder,
  type = "text",
  name,
  ...restProps
}, ref) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className="input input-bordered w-full"
        name={name}
        {...restProps}
      />
    </div>
  );
});

export default TextInput;
