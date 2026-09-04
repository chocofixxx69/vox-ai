import re

# Read Dashboard.jsx
with open(r'c:\Users\MY PC\desktop\MediVoiceAI\frontend\src\pages\Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements for dark/light mode
replacements = [
    # Backgrounds
    ('bg-slate-950 flex', 'bg-slate-50 dark:bg-slate-950 flex'),
    ('bg-slate-950/50', 'bg-white dark:bg-slate-900/50'),
    ('bg-slate-950/80', 'bg-white dark:bg-slate-900'),
    ('bg-slate-900/60', 'bg-slate-100 dark:bg-slate-900/60'),
    ('bg-slate-900', 'bg-slate-100 dark:bg-slate-900'),
    ('bg-slate-800', 'bg-white dark:bg-slate-800'),
    
    # Borders
    ('border-slate-900', 'border-slate-200 dark:border-slate-900'),
    ('border-slate-800', 'border-slate-300 dark:border-slate-800'),
    ('border-slate-700/50', 'border-slate-300 dark:border-slate-700/50'),
    ('border-white/5', 'border-slate-200 dark:border-slate-800'),
    
    # Text colors
    ('text-sky-400', 'text-primary-600 dark:text-primary-400'),
    ('text-indigo-400', 'text-primary-600 dark:text-primary-400'),
    ('text-slate-200', 'text-slate-900 dark:text-slate-200'),
    ('text-slate-300', 'text-slate-700 dark:text-slate-300'),
    ('text-slate-400', 'text-slate-600 dark:text-slate-400'),
    ('text-slate-500', 'text-slate-600 dark:text-slate-500'),
    ('text-slate-600', 'text-slate-700 dark:text-slate-600'),
    ('text-white', 'text-slate-900 dark:text-white'),
    
    # Hover states
    ('hover:text-white', 'hover:text-slate-900 dark:hover:text-white'),
    ('hover:bg-slate-900', 'hover:bg-slate-200 dark:hover:bg-slate-900'),
    ('hover:bg-slate-700', 'hover:bg-slate-200 dark:hover:bg-slate-700'),
    
    # Special cases
    ('bg-sky-500/10 text-sky-400 border border-sky-500/20', 'bg-primary-100 text-primary-700 border border-primary-300 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'),
    ('bg-sky-500/5', 'bg-primary-50 dark:bg-primary-900/10'),
    ('border-sky-500/10', 'border-primary-200 dark:border-primary-800'),
    ('border-sky-500/50', 'border-primary-400 dark:border-primary-600'),
    ('border-indigo-500/50', 'border-primary-400 dark:border-primary-600'),
    ('shadow-sky-500/10', 'shadow-primary-500/10'),
    ('text-sky-500', 'text-primary-600 dark:text-primary-500'),
]

# Apply replacements
for old, new in replacements:
    content = content.replace(old, new)

# Write back
with open(r'c:\Users\MY PC\desktop\MediVoiceAI\frontend\src\pages\Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Dashboard.jsx updated for dark/light mode!")
