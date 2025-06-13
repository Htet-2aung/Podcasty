import { SectionHeader } from "../components/SectionHeader";
import { useTheme as useThemeSettings } from "../context/ThemeProvider";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeSettings();
    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center h-8 rounded-full w-16 transition-colors bg-[--overlay]"
        >
            <span className="sr-only">Toggle Theme</span>
            <span className={`absolute left-1 top-1 inline-block w-6 h-6 rounded-full bg-[--primary] transition-transform duration-300 ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}`} />
        </button>
    )
}

export default function SettingsPage() {
    return (
        <div className="p-8">
            <SectionHeader title="Settings" />
            <div className="space-y-6 max-w-md">
                <div className="flex items-center justify-between bg-[--surface] p-4 rounded-lg">
                    <label className="font-semibold text-[--text-main]">Appearance</label>
                    <ThemeToggle />
                </div>
                 <div className="bg-[--surface] p-4 rounded-lg">
                    <h3 className="font-semibold text-[--text-main] mb-2">About</h3>
                    <p className="text-sm text-[--text-secondary]">Podscover App v2.0. Built with React & Vite.</p>
                </div>
            </div>
        </div>
    )
}