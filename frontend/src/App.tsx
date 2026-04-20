import React from 'react';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { HomePage } from './pages/home/HomePage';
import { ScreenLoaderProvider } from './contexts/ScreenLoader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: true,
      throwOnError: true,
    },
  },
});

function App() {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        let errorMessage = 'Something went wrong';
        // if (error instanceof ApiError) {
        //   errorMessage = error.error;
        // } else if (error instanceof Error) {
        //   errorMessage = error.message;
        // }
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        /**
         * @todo - prettify
         */
        return (
          <div>
            <p>{errorMessage}</p>
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload
            </button>
          </div>
        );
      }}
    >
      <React.Suspense fallback={<div>Loading...</div>}>
        <QueryClientProvider client={queryClient}>
          <ScreenLoaderProvider>
            <HomePage />
            <ToastContainer />
          </ScreenLoaderProvider>
        </QueryClientProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
}

export default App;
