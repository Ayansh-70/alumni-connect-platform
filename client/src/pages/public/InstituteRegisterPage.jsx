import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerInstituteRequest } from '../../api/institutes.js';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PasswordChecklist, { validatePasswordStrength } from '../../components/ui/PasswordChecklist.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

const STEPS = [
  { id: 1, title: 'Institute Info' },
  { id: 2, title: 'Administrator' },
  { id: 3, title: 'Review' }
];

function InstituteRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    instituteName: '',
    instituteType: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    adminName: '',
    designation: '',
    officialEmail: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordValid = validatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const validateStep = (step) => {
    if (step === 1) {
      const required = ['instituteName', 'instituteType', 'address', 'city', 'state', 'country'];
      if (required.some(field => !formData[field].trim())) {
        setErrorMessage('Please fill in all required institute details.');
        return false;
      }
    }
    if (step === 2) {
      const required = ['adminName', 'designation', 'officialEmail', 'phone', 'password', 'confirmPassword'];
      if (required.some(field => !formData[field].trim())) {
        setErrorMessage('Please fill in all required administrator details.');
        return false;
      }
      if (!isPasswordValid) {
        setErrorMessage('Please meet all password requirements.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    setErrorMessage('');
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setErrorMessage('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await registerInstituteRequest(formData);
      setCurrentStep('SUCCESS');
    } catch (error) {
      setErrorMessage(error.userMessage || 'Unable to submit institute registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'SUCCESS') {
    return (
      <div className="animate-fadeInUp mx-auto max-w-2xl py-12">
        <div className="surface-card p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-3xl text-success">
            ✓
          </div>
          <h2 className="mb-4 text-display font-bold tracking-tight text-text-primary">Application Submitted Successfully</h2>
          <p className="mb-6 text-body leading-7 text-text-secondary">
            Your institute registration has been received and is currently under review by the AlumniConnect team.
          </p>
          <div className="mt-6 flex justify-center">
            <StatusBadge value="PENDING" className="text-sm px-4 py-1.5" />
          </div>
          <p className="mt-6 text-caption text-text-muted">
            Once approved, you can log in using the email address and password you created during registration.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/" className="btn-secondary px-8 py-3 text-center">Return Home</Link>
            <Link to="/login" className="btn-primary px-8 py-3 text-center">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp mx-auto max-w-3xl pb-24">
      <PageHeader
        eyebrow="Institute onboarding"
        title="Register your institute"
        description="Join the verified network to connect students with trusted alumni."
      />

      {/* Step Indicator */}
      <div className="mb-10 mt-4">
        <div className="flex items-center justify-between relative px-8 sm:px-16">
          <div className="absolute left-12 right-12 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
          <div 
            className="absolute left-12 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-500"
            style={{ width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - 3rem)` }}
          />
          
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? 'border-primary bg-primary text-primary-foreground shadow-level-1' : isCompleted ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-muted'}`}>
                  {isCompleted ? '✓' : step.id}
                </div>
                <span className={`absolute -bottom-7 w-32 text-center text-badge font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="animate-fadeInUp alert-error mb-6" role="alert" aria-live="polite">
          {errorMessage}
        </div>
      )}

      <div className="surface-card p-6 md:p-10 mt-10">
        {currentStep === 1 && (
          <div className="animate-fadeInUp space-y-6">
            <h3 className="text-section font-bold text-text-primary">Institute Details</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="instituteName">
                  Institute Name *
                </label>
                <input id="instituteName" name="instituteName" value={formData.instituteName} onChange={handleChange} disabled={isSubmitting} className="field-control" placeholder="e.g. Global Tech University" />
              </div>
              <div>
                <label htmlFor="instituteType">
                  Institute Type *
                </label>
                <select id="instituteType" name="instituteType" value={formData.instituteType} onChange={handleChange} disabled={isSubmitting} className="field-control">
                  <option value="">Select type...</option>
                  <option value="University">University</option>
                  <option value="College">College</option>
                  <option value="High School">High School</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="website">
                  Website
                </label>
                <input id="website" name="website" value={formData.website} onChange={handleChange} disabled={isSubmitting} className="field-control" placeholder="https://" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address">
                  Address *
                </label>
                <input id="address" name="address" value={formData.address} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
              <div>
                <label htmlFor="city">
                  City *
                </label>
                <input id="city" name="city" value={formData.city} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
              <div>
                <label htmlFor="state">
                  State/Province *
                </label>
                <input id="state" name="state" value={formData.state} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country">
                  Country *
                </label>
                <input id="country" name="country" value={formData.country} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={nextStep} className="btn-primary px-8">Continue to Step 2</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fadeInUp space-y-6">
            <h3 className="text-section font-bold text-text-primary">Administrator Details</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="adminName">
                  Full Name *
                </label>
                <input id="adminName" name="adminName" value={formData.adminName} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
              <div>
                <label htmlFor="designation">
                  Designation *
                </label>
                <input id="designation" name="designation" value={formData.designation} onChange={handleChange} disabled={isSubmitting} className="field-control" placeholder="e.g. Dean of Alumni" />
              </div>
              <div>
                <label htmlFor="officialEmail">
                  Official Email *
                </label>
                <input id="officialEmail" name="officialEmail" type="email" value={formData.officialEmail} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
              <div>
                <label htmlFor="phone">
                  Phone Number *
                </label>
                <input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
              <div className="sm:col-span-2 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="mb-0">
                    Password *
                  </label>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} disabled={isSubmitting} className="field-control" />
                
                <PasswordChecklist password={formData.password} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} className="field-control" />
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button type="button" onClick={prevStep} className="btn-secondary px-8">Back</button>
              <button type="button" onClick={nextStep} className="btn-primary px-8">Continue to Review</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fadeInUp space-y-6">
            <h3 className="text-section font-bold text-text-primary">Review & Submit</h3>
            <p className="text-body text-text-secondary">Please review your details before submitting your application.</p>
            
            <div className="space-y-4 mt-6">
              <div className="rounded-lg border border-border bg-bg-secondary p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-body font-bold text-text-primary">Institute Information</h4>
                  <button type="button" onClick={() => setCurrentStep(1)} disabled={isSubmitting} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Edit</button>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Name</dt>
                    <dd className="font-medium text-text-primary">{formData.instituteName}</dd>
                  </div>
                  <div>
                    <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Type</dt>
                    <dd className="font-medium text-text-primary">{formData.instituteType}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Location</dt>
                    <dd className="font-medium text-text-primary">{formData.address}, {formData.city}, {formData.state}, {formData.country}</dd>
                  </div>
                  {formData.website && (
                    <div className="sm:col-span-2">
                      <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Website</dt>
                      <dd className="font-medium text-text-primary">{formData.website}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-lg border border-border bg-bg-secondary p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-body font-bold text-text-primary">Administrator Information</h4>
                  <button type="button" onClick={() => setCurrentStep(2)} disabled={isSubmitting} className="text-badge font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Edit</button>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Name</dt>
                    <dd className="font-medium text-text-primary">{formData.adminName}</dd>
                  </div>
                  <div>
                    <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Designation</dt>
                    <dd className="font-medium text-text-primary">{formData.designation}</dd>
                  </div>
                  <div>
                    <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Official Email</dt>
                    <dd className="font-medium text-text-primary">{formData.officialEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-badge font-bold uppercase tracking-wider text-text-muted mb-1">Phone</dt>
                    <dd className="font-medium text-text-primary">{formData.phone}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button type="button" onClick={prevStep} disabled={isSubmitting} className="btn-secondary px-8">Back</button>
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn-primary px-8">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstituteRegisterPage;
