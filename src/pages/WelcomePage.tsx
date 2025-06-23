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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-surface to-background text-text-main p-8 text-center">
      <div className="w-full max-w-md">
        <DotLottieReact
          src="https://lottie.host/79d8548c-3630-4f9e-9194-66aa466cc7c3/M1wQDyDKc5.lottie"
          loop
          autoplay
        />
      </div>
      <h1 className="text-5xl font-extrabold mt-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
        Say it with Podcast
      </h1>
      <p className="text-xl text-text-secondary mt-4 max-w-lg">
        Discover, listen, and subscribe to your favorite podcasts from around the world.
      </p>
      <Link
        to="/login"
        className="mt-12 px-12 py-4 text-xl font-bold text-white bg-primary rounded-full hover:bg-opacity-90 transition-transform hover:scale-105 duration-300 shadow-lg"
      >
        Get Started
      </Link>
    </div>
  );
};

export default WelcomePage;
