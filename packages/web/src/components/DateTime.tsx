import React from "react";
import DateTimerPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  className?: string;
  value?: string;
  onChange: (newDate: Date) => void;
}

const DateTime: React.FC<Props> = ({ className, onChange, value }) => {
  return (
    // TODO: fix react-datepicker-wrapper display block
    <DateTimerPicker
      className={className}
      selected={value ? new Date(value) : undefined}
      onChange={onChange}
      showTimeSelect
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
};

export default DateTime;
