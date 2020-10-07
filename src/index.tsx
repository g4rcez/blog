import React from "react";
import ReactDOM from "react-dom";
import Router from "./routes/routes";
import * as serviceWorker from "./serviceWorker";
import "./styles/css/dist/index.css";

const rootElement = document.getElementById("root");

const App = () => (
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

if (rootElement?.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}

serviceWorker.register();