import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider, 
} from "react-router-dom";
import { Welcome, Registration, Distribution, ErrorPage, Sandbox, Analysis }  from "./pages";
import { ConfigProvider } from 'antd';
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/registration",
    element: <Registration/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/sandbox",
    element: <Sandbox/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/service/distribution",
    element: <Distribution/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/service/analysis",
    element: <Analysis/>,
    errorElement: <ErrorPage/>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider theme={{
      token: {
      colorPrimary: '#00b96b',
      }
    }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
);