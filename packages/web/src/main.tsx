import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import Root from "./routes/Root";
import Web from './routes/Web';
import { captureLoader } from './loader';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    loader: captureLoader,
    path: "/web/:id",
    element: <Web />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
