import ReactDOM from "react-dom/client";

import {
  HashRouter,
} from "react-router-dom";

import App from "./App";
import "./styles/global.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <HashRouter>

    <App />

  </HashRouter>
);