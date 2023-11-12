import React from "react";
import clsx from "clsx";

interface SpinnerProps {
  size?: 'loading-lg' | 'loading-md' | 'loading-sm';
  className?: string;
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "loading-lg",
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
      {/* <div
        className={`border-t-4 border-blue-500 rounded-full animate-spin ${size}`}
      ></div> */}

      <span className={`loading loading-ring ${size}`}></span>
    </div>
  );
};

export default Spinner;
