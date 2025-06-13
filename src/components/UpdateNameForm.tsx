// src/components/UpdateNameForm.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserProvider';

const UpdateNameForm = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Populate the form with the user's current full name when the component loads
    if (user) {
      setFullName(user.user_metadata.full_name || '');
    }
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');

    // Supabase stores custom profile data in the 'data' property
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Your name has been updated successfully!');
      // You might want to refresh the user state here or let Supabase's onAuthStateChange handle it
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpdateName} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 search-input w-full"
          disabled={loading}
        />
      </div>
      <button type="submit" className="search-button" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
      {message && <p className="text-sm text-green-500 mt-2">{message}</p>}
    </form>
  );
};

export default UpdateNameForm;