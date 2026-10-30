import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Pages built by scripts/prerender.mjs arrive with their HTML; take it over instead of redrawing.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
