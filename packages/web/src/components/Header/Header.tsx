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
    <div className={clsx(className, "py-4 bg-white border-b")}>
      <div className="container mx-auto">
        <div className="flex justify-between">
          <Link to="/">
            <h1 className="">Capture Me!</h1>
          </Link>

          <div>
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
              <div className="flex items-center">
                <p>{auth.userInfo?.attributes.email}</p>
                {/* logout button */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2"
                  onClick={() => {
                    dispatch(logout() as any);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
