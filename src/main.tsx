import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { AudioProvider } from './context/AudioProvider.tsx';
import { UserProvider } from './context/UserProvider';

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
import SettingsPage from './pages/SettingsPage.tsx'; 
import ProtectedRoute from './components/ProtectedRoute.tsx';
import MobileLogin from './pages/mobile-login';
import './index.css';

const router = createBrowserRouter([
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

  {
    path: '/mobile-login',
    element: <MobileLogin />,
    errorElement: <ErrorPage />,
  },
  

  {
    path: '/',
    element: <ProtectedRoute />, 
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />, 
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
