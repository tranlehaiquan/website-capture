import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./routes/Home";
import Capture from "./routes/Capture";
import { useEffect } from "react";
import { initAuth } from "./store/auth/authSlice";
import { useDispatch } from "./store/store";
import VerifySignUp from "./routes/VerifySignUp";
import Dashboard from "./routes/Dashboard";
import RecurringCapture from "./routes/RecurringCapture";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/verify-signUp",
    element: <VerifySignUp />,
  },
  {
    path: "/capture/:id",
    element: <Capture />,
  },
  {
    path: "/recurring-capture/:id",
    element: <RecurringCapture />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
