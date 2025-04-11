import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { Auth } from "./features/Auth.tsx";
import { StorageProvider } from "./contexts/storage/StorageProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <Auth>
    <StorageProvider>
      <App />
    </StorageProvider>
  </Auth>
);
