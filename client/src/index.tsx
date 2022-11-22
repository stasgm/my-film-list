import React, { PropsWithChildren } from 'react';
import { BrowserRouter, useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { AppState, Auth0Provider, Auth0ProviderOptions } from "@auth0/auth0-react";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query/devtools";
import App from "./App";
import { ModalProvider } from './components/Modal';

import reportWebVitals from './reportWebVitals';

import './styles/index.css';

console.info('process.env.NODE_ENV:', process.env.NODE_ENV);

Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: "https://ed8829d7626949d8ad310c2ffa1ac677@o110716.ingest.sentry.io/4504051125846016",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

const Auth0ProviderWithRedirectCallback = ({
  children,
  ...props
}: PropsWithChildren<Auth0ProviderOptions>) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback
        domain={process.env.REACT_APP_DOMAIN!}
        clientId={process.env.REACT_APP_CLIENT_ID!}
        redirectUri={window.location.origin}
        audience={process.env.REACT_APP_AUDIENCE!}
        useRefreshTokens
        cacheLocation="localstorage"
      >
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <App />
          </ModalProvider>
          {/* <ReactQueryDevtools initialIsOpen /> */}
        </QueryClientProvider>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
