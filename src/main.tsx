// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LoginPage from './pages/LoginPage.tsx';     // 1. Import
import SignupPage from './pages/SignupPage.tsx';
// Import all your components and providers
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import PodcastPage from './pages/PodcastPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx'; // Good practice to have an error page
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { AudioProvider } from './context/AudioProvider.tsx';
import { UserProvider } from './context/UserProvider'; // 1. Import UserProvider
import LibraryPage from './pages/LibraryPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import './index.css';
import CategoryPage from './pages/CategoryPage.tsx';
// Define the application's routes
const router = createBrowserRouter([
  // Public routes
  {
    path: '/welcome',
    element: <WelcomePage />,
    errorElement: <ErrorPage />,
  },
  
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />, // This will show if a major error occurs
    children: [
      {
        path: '/',
        element: <HomePage />,
      },

      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        // FIXED: This is the crucial change.
        // The ':podcastId' tells the router to capture the value from the URL
        // and make it available via the useParams() hook in PodcastPage.
        path: 'podcast/:podcastId',
        element: <PodcastPage />,
      },

      // 2. ADD THE NEW ROUTE TO THE LIST
      {
        path: 'library',
        element: <LibraryPage />,
      },

      {
        path: 'profile',
        element: <ProfilePage />,
      },

      {
        path: 'category/:genreId',
        element: <CategoryPage />,
      },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <UserProvider>
          <AudioProvider>
            <RouterProvider router={router} />
          </AudioProvider>
        </UserProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
