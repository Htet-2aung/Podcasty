// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Provider } from '@supabase/supabase-js';

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

  const handleOAuthLogin = async (provider: Provider) => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* Left side: Login Form */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:order-1 order-2">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-text-main">Log In</h1>
            <p className="text-text-secondary mt-2">Welcome back! Sign in to continue.</p>

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
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-overlay" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-text-secondary">Or continue with</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleOAuthLogin('google')}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-overlay rounded-lg shadow-sm bg-surface text-sm font-medium text-text-main hover:bg-overlay transition-colors"
              >
                Sign in with Google
              </button>
              <button
                onClick={() => handleOAuthLogin('tiktok')}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-overlay rounded-lg shadow-sm bg-surface text-sm font-medium text-text-main hover:bg-overlay transition-colors"
              >
                Sign in with TikTok
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        
        {/* Right side: Lottie Animation */}
        <div className="flex flex-col items-center justify-center bg-surface p-12 text-center lg:order-2 order-1">
          <div className="w-full max-w-sm">
            <DotLottieReact
              src="https://lottie.host/aa65962d-fa5a-4535-9c12-1b8eec446804/D81ZSOSAbp.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-4xl font-bold mt-6 text-text-main hidden lg:block">Welcome Back</h1>
          <p className="text-lg mt-2 text-text-secondary hidden lg:block">
            Sign in to access your library and favorite podcasts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
