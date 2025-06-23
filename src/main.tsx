// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { AudioProvider } from './context/AudioProvider.tsx';
import { UserProvider } from './context/UserProvider';

// Import Pages and Components
import App from './App.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import WelcomePage from './pages/WelcomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import HomePage from './pages/HomePage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import PodcastPage from './pages/PodcastPage.tsx';
import LibraryPage from './pages/LibraryPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx'; // Import the SettingsPage
import ProtectedRoute from './components/ProtectedRoute.tsx';

import './index.css';

// Define the application's routes
const router = createBrowserRouter([
  // ... (public routes remain the same)
  {
    path: '/welcome',
    element: <WelcomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
    errorElement: <ErrorPage />,
  },

  // Protected routes that require a user to be logged in
  {
    path: '/',
    element: <ProtectedRoute />, // This component guards all children
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />, // App renders the main layout (sidebar, etc.)
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: 'search',
            element: <SearchPage />,
          },
          {
            path: 'podcast/:podcastId',
            element: <PodcastPage />,
          },
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
          // --- ADD THIS ROUTE ---
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
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
