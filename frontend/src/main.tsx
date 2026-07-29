import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/shared/theme";
import { MotionProvider } from "@/shared/motion";
import { QueryProvider, ErrorBoundary } from "@/shared/components";
import { App } from "./app/App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <MotionProvider>
          <QueryProvider>
            <App />
            <Toaster position="top-right" richColors closeButton />
          </QueryProvider>
        </MotionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
