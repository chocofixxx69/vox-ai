import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all border border-slate-200 dark:border-slate-700 ${className}`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? (
                <>
                    <Sun className="w-4 h-4" />
                    <span className="text-xs font-medium">Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4" />
                    <span className="text-xs font-medium">Dark Mode</span>
                </>
            )}
        </motion.button>
    );
};

export default ThemeToggle;
