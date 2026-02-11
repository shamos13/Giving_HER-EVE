import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { ToastContainer } from "react-toastify"
import "./index.css"
import "react-toastify/dist/ReactToastify.css"
import App from "./App"

const rootElement = document.getElementById("root")

if (!rootElement) throw new Error("Root container missing")

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" autoClose={2500} newestOnTop closeOnClick pauseOnFocusLoss={false} />
    </BrowserRouter>
  </StrictMode>,
)
