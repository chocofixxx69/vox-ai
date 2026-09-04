import re

# Read ConsultationWizard.jsx
with open(r'c:\Users\MY PC\desktop\MediVoiceAI\frontend\src\components\ConsultationWizard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Define comprehensive replacements for dark/light mode
replacements = [
    # Backgrounds
    ('bg-slate-50', 'bg-white dark:bg-slate-900'),
    ('bg-slate-100', 'bg-slate-100 dark:bg-slate-800'),
    ('bg-white', 'bg-white dark:bg-slate-900'),
    
    # Borders
    ('border-slate-200', 'border-slate-200 dark:border-slate-800'),
    ('border-slate-300', 'border-slate-300 dark:border-slate-700'),
    
    # Text colors
    ('text-slate-900', 'text-slate-900 dark:text-white'),
    ('text-slate-700', 'text-slate-700 dark:text-slate-300'),
    ('text-slate-600', 'text-slate-600 dark:text-slate-400'),
    ('text-blue-600', 'text-primary-600 dark:text-primary-400'),
    ('text-blue-500', 'text-primary-600 dark:text-primary-400'),
    
    # Hover states
    ('hover:bg-slate-50', 'hover:bg-slate-100 dark:hover:bg-slate-800'),
    ('hover:border-slate-400', 'hover:border-slate-400 dark:hover:border-slate-600'),
    
    # Focus states
    ('focus:border-blue-500', 'focus:border-primary-500 dark:focus:border-primary-400'),
    ('focus:ring-blue-500/20', 'focus:ring-primary-500/20 dark:focus:ring-primary-400/20'),
    ('focus-within:border-blue-400', 'focus-within:border-primary-500 dark:focus-within:border-primary-400'),
    
    # Shadows
    ('shadow-blue-500/20', 'shadow-primary-500/20'),
    ('shadow-blue-500/30', 'shadow-primary-500/30'),
    
    # Special components
    ('bg-blue-50', 'bg-primary-50 dark:bg-primary-900/20'),
    ('bg-blue-600', 'bg-primary-600 dark:bg-primary-500'),
    ('border-blue-200', 'border-primary-200 dark:border-primary-800'),
    ('border-blue-300', 'border-primary-300 dark:border-primary-700'),
    ('border-blue-400', 'border-primary-400 dark:border-primary-600'),
]

# Apply replacements
for old, new in replacements:
    content = content.replace(old, new)

# Write back
with open(r'c:\Users\MY PC\desktop\MediVoiceAI\frontend\src\components\ConsultationWizard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ ConsultationWizard.jsx updated for dark/light mode!")
