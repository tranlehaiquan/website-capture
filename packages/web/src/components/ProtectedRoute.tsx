import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Props {
  className?: string;
}

export const ProtectedRoute: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const isAuthenticated = useSelector((state: RootState) => state.authReducer.isAuthenticated);
  if (!isAuthenticated) {
    // user is not authenticated
    return <Navigate to="/signIn" />;
  }

  return children;
};

export default ProtectedRoute;
