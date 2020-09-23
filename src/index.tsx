import React from "react";
import ReactDOM from "react-dom";
import "./styles/css/dist/index.css";
import Router from "./routes/routes";
import { Settings } from "./global/settings.store";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Settings>
      <Router />
    </Settings>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
