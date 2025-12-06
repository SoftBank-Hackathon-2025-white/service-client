import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import GlobalStyle from './theme/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import theme from './theme/theme.ts';
import { PATHS } from './constants/paths.ts';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Whiteboard from './components/pages/Whiteboard.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from './components/pages/HomePage.jsx';
import { TracePage } from './components/pages/TracePage.jsx';

async function enableMocking() {
  if (import.meta.env['VITE_ENABLE_MSW'] === 'true') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: PATHS.MAIN,
        element: <HomePage />,
      },
      {
        path: PATHS.WHITEBOARD,
        element: <Whiteboard />,
      },
      { path: PATHS.EXECUTION, element: <TracePage /> },
    ],
  },
]);

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});
