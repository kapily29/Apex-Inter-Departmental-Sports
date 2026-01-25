import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import { PlayerProvider } from "./context/PlayerContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <PlayerProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </PlayerProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
