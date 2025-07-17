import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider direction="ltr">
      <App />
    </ConfigProvider>
  </StrictMode>
);
