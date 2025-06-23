// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoginPage = () => {
  const { session } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">
      {/* Left side: Lottie Animation and Branding (visible on large screens) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-surface p-12 text-center">
        <div className="w-full max-w-sm">
          <DotLottieReact
            src="https://lottie.host/e67163cc-700f-43fa-ac8a-33e9326d8395/BMW7ZD9dwm.lottie"
            loop
            autoplay
          />
        </div>
        <h1 className="text-4xl font-bold mt-6 text-text-main">Welcome Back</h1>
        <p className="text-lg mt-2 text-text-secondary">
          Sign in to access your library and favorite podcasts.
        </p>
      </div>

      {/* Right side: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 h-screen">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
             <div className="w-40 h-40 mx-auto">
                <DotLottieReact src="/podcast-animation.lottie" loop autoplay />
             </div>
             <h1 className="text-3xl font-bold text-text-main">Log In</h1>
          </div>
          
          <h1 className="hidden lg:block text-3xl font-bold text-text-main">Log In</h1>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-md text-sm">{error}</p>}
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-overlay rounded-lg text-text-main focus:ring-primary focus:border-primary transition"
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-overlay rounded-lg text-text-main focus:ring-primary focus:border-primary transition"
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full py-3 px-4 font-bold text-white bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            
            <p className="text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
