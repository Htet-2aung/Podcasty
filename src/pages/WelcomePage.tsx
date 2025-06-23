import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const WelcomePage = () => {
  const { session } = useUser();

  // If the user is already logged in, redirect them to the home page.
  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-text-main p-8 text-center">
     <div className="w-auto h-auto max-w-xs max-h-80 mb-8">
        <DotLottieReact
          src="https://lottie.host/79d8548c-3630-4f9e-9194-66aa466cc7c3/M1wQDyDKc5.lottie"
          loop
          autoplay
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">Say it with Podcast</h1>
      <p className="text-lg text-text-secondary mb-8 max-w-sm">
        Discover, listen, and subscribe to your favorite podcasts from around the world.
      </p>
      <Link
        to="/login"
        className="px-10 py-3 font-bold text-white bg-primary rounded-full hover:opacity-90 transition-all text-lg"
      >
        Get Started
      </Link>
    </div>
  );
};

export default WelcomePage;
