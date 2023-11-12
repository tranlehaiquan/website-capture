import React from "react";
import clsx from "clsx";

interface Props {
  className?: string;
}

const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer className={clsx(className, "py-4")}>
      <div className="container">
        © 2023 Capture with ♥ for the people of the internet.
      </div>
    </footer>
  );
};

export default Footer;
