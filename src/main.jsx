import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { GoogleOAuthProvider } from "@react-oauth/google";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="279586218412-bva4lvgdegecg0p5hpuompifhnns21sf.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
  </React.StrictMode>,
)
