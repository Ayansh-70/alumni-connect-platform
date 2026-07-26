import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePasswordRequest } from '../../api/auth.js';
import PasswordChecklist, { validatePasswordStrength } from '../../components/ui/PasswordChecklist.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function ForcePasswordChangePage() {
  const navigate = useNavigate();
  const { logout, updateCurrentUser, user } = useAuth();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isPasswordValid = validatePasswordStrength(formData.newPassword);

  useEffect(() => {
    if (user && !user.mustChangePassword) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.currentPassword) {
      setErrorMessage('Please enter your current temporary password.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your new password meets all requirements.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }
    
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await changePasswordRequest({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setIsSuccess(true);
      
      // Update the auth context so the user doesn't get redirected back here
      if (updateCurrentUser) {
        updateCurrentUser(res.data.user);
      }
      
      // Auto-redirect to dashboard after brief delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to update password. Please check your current password and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-display font-bold tracking-tight text-text-primary">
          Update Your Password
        </h2>
        <p className="mt-2 text-center text-body text-text-secondary px-4">
          For your security, please change your temporary password before accessing your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="surface-card p-8">
          {isSuccess ? (
            <div className="animate-fadeInUp text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                ✓
              </div>
              <h3 className="mb-2 text-section font-bold text-text-primary">Password Updated!</h3>
              <p className="mb-6 text-body text-text-secondary">
                Your account is now secure. Redirecting you to your dashboard...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="animate-fadeInUp alert-error" role="alert" aria-live="polite">
                  {errorMessage}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="currentPassword" className="mb-0">
                    Current Password
                  </label>
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                    {showCurrentPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                    placeholder="Enter your temporary password"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="newPassword" className="mb-0">
                    New Password
                  </label>
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                    {showNewPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                  />
                </div>
                <PasswordChecklist password={formData.newPassword} />
              </div>

              <div>
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="field-control"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-2.5"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              <div className="text-center mt-4">
                 <button
                   type="button"
                   onClick={handleLogout}
                   className="text-button text-text-secondary hover:text-text-primary underline underline-offset-2"
                 >
                   Log out and do this later
                 </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForcePasswordChangePage;
