import React from "react";
import ReactDOM from "react-dom/client";
import axios from 'axios';
import {
  createBrowserRouter,
  RouterProvider, 
} from "react-router-dom";
import { Welcome, Registration, Distribution, ErrorPage, Sandbox, Analysis }  from "./pages";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/registration",
    element: <Registration/>
  },
  {
    path: "/sandbox",
    element: <Sandbox/>
  },
  {
    path: "/service/distribution",
    element: <Distribution/>,
  },
  {
    path: "/service/analysis",
    element: <Analysis/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);