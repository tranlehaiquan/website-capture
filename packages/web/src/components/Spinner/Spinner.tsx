import React from "react";
import clsx from "clsx";

interface SpinnerProps {
  size?: string;
  className?: string;
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "w-12 h-12",
  className,
  fullScreen,
}) => {
  return (
    <div
      className={clsx(
        "inline-flex justify-center items-center",
        className,
        fullScreen && "h-screen"
      )}
    >
      <div
        className={`border-t-4 border-blue-500 rounded-full animate-spin ${size}`}
      ></div>
    </div>
  );
};

export default Spinner;
