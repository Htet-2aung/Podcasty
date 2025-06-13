// src/pages/ErrorPage.tsx

import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  // This hook captures the error thrown by React Router
  const error = useRouteError();
  console.error("Router Error:", error);

  let errorMessage: string;
  let errorStatus: number | undefined;

  // The 'isRouteErrorResponse' function helps us check if it's a response-related error
  // like a 404 Not Found, 403 Forbidden, etc.
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'An unexpected error occurred.';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unknown error occurred.';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <div className="bg-surface p-8 rounded-lg shadow-xl max-w-md w-full">
        {errorStatus && (
          <h1 className="text-8xl font-bold text-primary">{errorStatus}</h1>
        )}
        <h2 className="mt-4 text-3xl font-bold text-text-main">Oops! Something went wrong.</h2>
        <p className="mt-2 text-lg text-text-secondary">
          We can't seem to find the page you're looking for or an error occurred.
        </p>
        <p className="mt-4 p-2 bg-overlay rounded font-mono text-sm text-text-tertiary">
          <i>{errorMessage}</i>
        </p>
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 font-bold text-white bg-primary rounded-lg hover:opacity-90 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;