import React from "react";
import clsx from "clsx";
import { CAPTURE_TYPES } from "shared";
import CaptureOneTimeForm from "./CaptureOneTimeForm";
import CaptureRecurringForm from "./CaptureRecurringForm";

interface Props {
  className?: string;
  onSubmit: (data: any) => void;
  disabled?: boolean;
}

const CaptureInput: React.FC<Props> = ({ className, onSubmit }) => {
  // tab
  const [tab, setTab] = React.useState<CAPTURE_TYPES>(
    CAPTURE_TYPES["One Time"]
  );

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      captureType: tab,
    })
  }

  return (
    <div className={clsx(className)}>
      <div role="tablist" className="tabs tabs-boxed">
        {Object.keys(CAPTURE_TYPES).map((key) => (
          <a
            key={key}
            role="tab"
            className={clsx("tab", {
              "tab-active":
                tab === CAPTURE_TYPES[key as keyof typeof CAPTURE_TYPES],
            })}
            onClick={() =>
              setTab(CAPTURE_TYPES[key as keyof typeof CAPTURE_TYPES])
            }
          >
            {key}
          </a>
        ))}
      </div>

      <div>
        {tab === CAPTURE_TYPES["One Time"] && (
          <CaptureOneTimeForm onSubmit={handleSubmit} />
        )}
        {tab === CAPTURE_TYPES["Recurring"] && (
          <CaptureRecurringForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default CaptureInput;
