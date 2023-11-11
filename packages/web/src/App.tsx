import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";

import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./routes/Home";
import Capture from "./routes/Capture";
import { useEffect } from "react";
import { initAuth } from "./store/auth/authSlice";

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
    path: "/capture/:id",
    element: <Capture />,
  },
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth() as any);
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
