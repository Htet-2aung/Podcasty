// src/pages/ProfilePage.tsx

import React from 'react';
import { User as UserIcon } from "lucide-react";
import { useUser } from '../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import UpdateNameForm from '../components/UpdateNameForm';
import UpdatePasswordForm from '../components/UpdatePasswordForm';

export default function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  // If the user is not logged in, redirect them to the login page
  if (!user) {
    navigate('/login');
    return null; // Render nothing while redirecting
  }

  // Get user details, with fallbacks for empty values
  const fullName = user.user_metadata.full_name || 'No name set';
  const userEmail = user.email || 'No email found';

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile & Settings</h1>
      
      {/* --- Profile Information Section --- */}
      <div className="flex items-center gap-6 bg-surface p-6 rounded-lg shadow-sm">
        <div className="w-24 h-24 bg-overlay rounded-full flex items-center justify-center flex-shrink-0">
          <UserIcon size={48} className="text-text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-main">{fullName}</h2>
          <p className="text-text-secondary">{userEmail}</p>
        </div>
      </div>
      
      {/* --- Settings Section --- */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-surface p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-text-main">Update Your Name</h3>
          <UpdateNameForm />
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-text-main">Change Password</h3>
          <UpdatePasswordForm />
        </div>

      </div>
    </div>
  )
}