import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "bootstrap/dist/js/bootstrap.min.js";

import "popper.js/dist/umd/popper.min.js";
import "jquery/dist/jquery.slim.min.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store, persistor } from "./app/store";
import { Provider } from "react-redux";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { PersistGate } from "redux-persist/integration/react";
if (process.env.NODE_ENV === "production") disableReactDevTools();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
