import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        authorizationParams={{
          redirect_uri: `${window.location.origin}/login`,
          audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
          // scope: "read:client_grants create:client_grants read:posts",
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
