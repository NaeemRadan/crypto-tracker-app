import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.tsx';
import './index.css';
import './i18n';
import './App.module.css';

const CoinDetailPage = lazy(() => import('./pages/CoinDetailPage.tsx'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/coin/:coinId",
    element: (
      <Suspense fallback={<div style={{ color: 'white', fontSize: '2rem', textAlign: 'center', paddingTop: '5rem' }}>Loading Page...</div>}>
        <CoinDetailPage />
      </Suspense>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
