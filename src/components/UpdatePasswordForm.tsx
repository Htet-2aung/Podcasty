// src/components/UpdatePasswordForm.tsx

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UpdatePasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(`Error: ${updateError.message}`);
    } else {
      setMessage('Your password has been updated successfully!');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4">
      {message && <p className="text-sm text-green-500">{message}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 search-input w-full"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 search-input w-full"
          disabled={loading}
        />
      </div>
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};

export default UpdatePasswordForm;