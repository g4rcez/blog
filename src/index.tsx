import React from "react";
import ReactDOM from "react-dom";
import "./styles/css/dist/index.css";
import Router from "./routes/routes";
import { Settings } from "./global/settings.store";
import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");

const App = () => (
  <React.StrictMode>
    <Settings>
      <Router />
    </Settings>
  </React.StrictMode>
);

if (rootElement?.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}

serviceWorker.unregister();
