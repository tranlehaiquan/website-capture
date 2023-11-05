import React from "react";
import auth from "../signals/auth";
import { Navigate } from "react-router-dom";

interface Props {
  className?: string;
}

export const ProtectedRoute: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  if (!auth.value.isAuthenticated) {
    // user is not authenticated
    return <Navigate to="/signIn" />;
  }

  return children;
};

export default ProtectedRoute;
