/**
 * Точка входа клиента: монтирует App в HTML-элемент root.
 * Provider делает Redux доступным компонентам, CssBaseline задаёт базовые стили Material UI.
 * StrictMode включает дополнительные проверки React при разработке.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import { CssBaseline } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </React.StrictMode>,
);
