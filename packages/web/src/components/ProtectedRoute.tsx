import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Spinner from "./Spinner";

interface Props {
  className?: string;
}

export const ProtectedRoute: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const authenticating = useSelector(
    (state: RootState) => state.authReducer.authenticating
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.authReducer.isAuthenticated
  );

  if (authenticating) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    // user is not authenticated
    return <Navigate to="/signIn" />;
  }

  return children;
};

export default ProtectedRoute;
