import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useDispatch } from "../../store/store";
import { logout } from "../../store/auth/authSlice";

interface Props {
  className?: string;
}

const Header: React.FC<Props> = ({ className }) => {
  const auth = useSelector((state: RootState) => state.authReducer);
  const dispatch = useDispatch();

  return (
    <div className={clsx(className, "py-4")}>
      <div className="container">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link to="/">
              <h1 className="">Capture Me!</h1>
            </Link>
          </div>
          <div className="flex-none">
            {!auth.isAuthenticated && (
              <>
                <Link
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2"
                  to="/signIn"
                >
                  Sign In
                </Link>
                <Link
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2"
                  to="/signUp"
                >
                  Sign Up
                </Link>
              </>
            )}

            {auth.isAuthenticated && (
              <div>
                {/* Link to Dashboard */}
                <div className="flex items-center">
                  <Link
                    className="text-blue-500 py-2 px-4 rounded mr-2"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>

                  <p>{auth.userInfo?.attributes.email}</p>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2"
                    onClick={() => {
                      dispatch(logout() as any);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
