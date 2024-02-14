import React from "react";
import ReactDOM from "react-dom/client";
import { ThemedApp } from "./app";
import { Toaster } from "sonner";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemedApp />
    <Toaster richColors />
  </React.StrictMode>
);
