import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./routes/Home";
import Capture from "./routes/Capture";
import { API } from "aws-amplify";

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
    loader: async ({ params }) => {
      return await API.get(
        "capture",
        `/capture/${params.id}?preSigned=true`,
        {}
      );
    },
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
