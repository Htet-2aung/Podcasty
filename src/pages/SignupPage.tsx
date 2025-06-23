import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserProvider';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Provider } from '@supabase/supabase-js';

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
        {/* Left side: Signup Form */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:order-1 order-2">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-text-main">Create Account</h1>
            <p className="text-text-secondary mt-2">Join the community to start your podcast journey.</p>

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
                Sign up with Google
              </button>
              <button
                onClick={() => handleOAuthLogin('tiktok')}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-overlay rounded-lg shadow-sm bg-surface text-sm font-medium text-text-main hover:bg-overlay transition-colors"
              >
                Sign up with TikTok
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Right side: Lottie Animation */}
        <div className="flex flex-col items-center justify-center bg-surface p-12 text-center lg:order-2 order-1">
          <div className="w-full max-w-sm">
            <DotLottieReact
              src="https://lottie.host/e67163cc-700f-43fa-ac8a-33e9326d8395/BMW7ZD9dwm.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-4xl font-bold mt-6 text-text-main hidden lg:block">Join the Community</h1>
          <p className="text-lg mt-2 text-text-secondary hidden lg:block">
            Create an account to start your podcast journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
