// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
// If user is already logged in, redirect to home
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
      navigate('/'); // Redirect to homepage after successful login
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center pt-16">
      <div className="w-48 h-48">
        <DotLottieReact
          src="https://lottie.host/e67163cc-700f-43fa-ac8a-33e9326d8395/BMW7ZD9dwm.lottie"
          loop
          autoplay
        />
      </div>
      
      <form onSubmit={handleLogin} className="bg-surface p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
        {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-md mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-text-secondary mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-input w-full"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-text-secondary mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="search-input w-full"
            required
          />
        </div>
        <button type="submit" className="search-button w-full justify-center" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <p className="text-center mt-4 text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
