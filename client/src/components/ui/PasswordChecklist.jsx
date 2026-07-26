import React from 'react';
import { Check, Dot } from 'lucide-react';

function PasswordChecklist({ password = '' }) {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const getCriterionClass = (isValid) => 
    `flex items-center gap-1.5 transition-colors ${isValid ? 'text-success' : 'text-text-muted'}`;

  const renderIcon = (isValid) => 
    isValid ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Dot className="h-4 w-4" strokeWidth={3} />;

  return (
    <div className="mt-4 grid grid-cols-1 gap-2 text-caption font-medium sm:grid-cols-2">
      <div className={getCriterionClass(criteria.length)}>
        {renderIcon(criteria.length)} At least 8 characters
      </div>
      <div className={getCriterionClass(criteria.uppercase)}>
        {renderIcon(criteria.uppercase)} One uppercase letter
      </div>
      <div className={getCriterionClass(criteria.lowercase)}>
        {renderIcon(criteria.lowercase)} One lowercase letter
      </div>
      <div className={getCriterionClass(criteria.number)}>
        {renderIcon(criteria.number)} One number
      </div>
      <div className={getCriterionClass(criteria.special)}>
        {renderIcon(criteria.special)} One special character
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
