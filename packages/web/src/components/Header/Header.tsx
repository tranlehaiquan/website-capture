import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
}

const Header: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className, "py-4 bg-white border-b")}>
      <div className="container mx-auto">
        <div className="flex justify-between">
          <Link to="/">
            <h1 className="">Capture Me!</h1>
          </Link>

          <div>
            {/* login link */}
            <Link
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2"
              to="/signIn"
            >
              Sign In
            </Link>
            {/* register link */}
            <Link
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2"
              to="/signUp"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
