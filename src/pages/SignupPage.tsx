// src/pages/SignupPage.tsx

import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SignupPage = () => {
  const { session } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Signup successful! Please check your email to verify your account.');
      navigate('/login');
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
            src="https://lottie.host/aa65962d-fa5a-4535-9c12-1b8eec446804/D81ZSOSAbp.lottie"
            loop
            autoplay
          />
        </div>
        <h1 className="text-4xl font-bold mt-6 text-text-main">Join the Community</h1>
        <p className="text-lg mt-2 text-text-secondary">
          Create an account to start your podcast journey.
        </p>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 h-screen">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
             <div className="w-40 h-40 mx-auto">
                <DotLottieReact src="/podcast-animation.lottie" loop autoplay />
             </div>
             <h1 className="text-3xl font-bold text-text-main">Create Account</h1>
          </div>
          
          <h1 className="hidden lg:block text-3xl font-bold text-text-main">Create Account</h1>

          <form onSubmit={handleSignup} className="mt-8 space-y-6">
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
                placeholder="6+ characters"
              />
            </div>

            <button type="submit" className="w-full py-3 px-4 font-bold text-white bg-primary rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
