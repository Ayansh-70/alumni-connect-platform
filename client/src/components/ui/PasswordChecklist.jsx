import React from 'react';

function PasswordChecklist({ password = '' }) {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  return (
    <div className="mt-4 grid grid-cols-1 gap-2 text-[0.7rem] font-medium tracking-wide sm:grid-cols-2">
      <div className={`flex items-center gap-2 transition-colors ${criteria.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
        <span className="text-sm">{criteria.length ? '✓' : '•'}</span> At least 8 characters
      </div>
      <div className={`flex items-center gap-2 transition-colors ${criteria.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
        <span className="text-sm">{criteria.uppercase ? '✓' : '•'}</span> One uppercase letter
      </div>
      <div className={`flex items-center gap-2 transition-colors ${criteria.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
        <span className="text-sm">{criteria.lowercase ? '✓' : '•'}</span> One lowercase letter
      </div>
      <div className={`flex items-center gap-2 transition-colors ${criteria.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
        <span className="text-sm">{criteria.number ? '✓' : '•'}</span> One number
      </div>
      <div className={`flex items-center gap-2 transition-colors ${criteria.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
        <span className="text-sm">{criteria.special ? '✓' : '•'}</span> One special character
      </div>
    </div>
  );
}

export function validatePasswordStrength(password) {
  if (!password) return false;
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export default PasswordChecklist;
