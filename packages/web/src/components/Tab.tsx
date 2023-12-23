import clsx from "clsx";
import React from "react";

type Option = {
  label: string;
  value: string;
};

interface Props {
  className?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const Tab: React.FC<Props> = ({ value, onChange, options, className }) => {
  return (
    <div role="tablist" className={clsx("tabs tabs-boxed", className)}>
      {options.map((option) => (
        <a
          role="tab"
          className={clsx("tab", value === option.value && "tab-active")}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </a>
      ))}
    </div>
  );
};

export default Tab;
