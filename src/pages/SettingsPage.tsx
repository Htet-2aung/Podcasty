// src/pages/SettingsPage.tsx

import { SectionHeader } from "../components/SectionHeader";
import { useTheme } from "../context/ThemeProvider";
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    // --- FIX: Use setTheme from the context ---
    const { theme, setTheme } = useTheme();

    // --- FIX: Define the toggle logic here ---
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center h-8 rounded-full w-16 transition-colors bg-overlay"
        >
            <span className="sr-only">Toggle Theme</span>
            
            {/* Sun Icon for Light Mode */}
            <span className={`absolute left-2 transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
                <Sun size={20} className="text-yellow-500" />
            </span>

            {/* Moon Icon for Dark Mode */}
            <span className={`absolute right-2 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                <Moon size={20} className="text-slate-300" />
            </span>

            {/* The sliding circle */}
            <span
                className={`absolute top-1 inline-block w-6 h-6 rounded-full bg-primary transition-transform duration-300 ${
                    theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                }`}
            />
        </button>
    )
}

export default function SettingsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <SectionHeader title="Settings" />
            <div className="space-y-6 max-w-md">
                <div className="flex items-center justify-between bg-surface p-4 rounded-lg">
                    <label className="font-semibold text-text-main">Appearance</label>
                    <ThemeToggle />
                </div>
                 <div className="bg-surface p-4 rounded-lg">
                    <h3 className="font-semibold text-text-main mb-2">About</h3>
                    <p className="text-sm text-text-secondary">Podcasty App v1.0. Built with React, Vite, and Supabase.</p>
                </div>
            </div>
        </div>
    )
}
