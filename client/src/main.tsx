import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
