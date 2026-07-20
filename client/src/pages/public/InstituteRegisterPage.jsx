import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerInstituteRequest } from '../../api/institutes.js';
import PageHeader from '../../components/ui/PageHeader.jsx';
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

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password)
  };
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600 shadow-xl shadow-emerald-500/20">
            ✓
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Application Submitted Successfully</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Your institute registration has been received and is currently under review by the AlumniConnect team.
          </p>
          <div className="mt-6 flex justify-center">
            <StatusBadge value="PENDING" className="text-sm px-4 py-1.5" />
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
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
          <div className="absolute left-12 right-12 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
          <div 
            className="absolute left-12 top-1/2 h-0.5 -translate-y-1/2 bg-brand-500 transition-all duration-500"
            style={{ width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - 3rem)` }}
          />
          
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30' : isCompleted ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400' : 'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900'}`}>
                  {isCompleted ? '✓' : step.id}
                </div>
                <span className={`absolute -bottom-7 w-32 text-center text-[0.65rem] font-bold uppercase tracking-wider ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="animate-fadeInUp alert-error mb-6">
          {errorMessage}
        </div>
      )}

      <div className="surface-card p-6 md:p-10 mt-10">
        {currentStep === 1 && (
          <div className="animate-fadeInUp space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Institute Details</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="instituteName">
                  Institute Name *
                </label>
                <input id="instituteName" name="instituteName" value={formData.instituteName} onChange={handleChange} className="field-control mt-2" placeholder="e.g. Global Tech University" />
              </div>
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="instituteType">
                  Institute Type *
                </label>
                <select id="instituteType" name="instituteType" value={formData.instituteType} onChange={handleChange} className="field-control mt-2">
                  <option value="">Select type...</option>
                  <option value="University">University</option>
                  <option value="College">College</option>
                  <option value="High School">High School</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="website">
                  Website
                </label>
                <input id="website" name="website" value={formData.website} onChange={handleChange} className="field-control mt-2" placeholder="https://" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="address">
                  Address *
                </label>
                <input id="address" name="address" value={formData.address} onChange={handleChange} className="field-control mt-2" />
              </div>
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="city">
                  City *
                </label>
                <input id="city" name="city" value={formData.city} onChange={handleChange} className="field-control mt-2" />
              </div>
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="state">
                  State/Province *
                </label>
                <input id="state" name="state" value={formData.state} onChange={handleChange} className="field-control mt-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="country">
                  Country *
                </label>
                <input id="country" name="country" value={formData.country} onChange={handleChange} className="field-control mt-2" />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={nextStep} className="btn-primary px-8">Continue to Step 2</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fadeInUp space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Administrator Details</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="adminName">
                  Full Name *
                </label>
                <input id="adminName" name="adminName" value={formData.adminName} onChange={handleChange} className="field-control mt-2" />
              </div>
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="designation">
                  Designation *
                </label>
                <input id="designation" name="designation" value={formData.designation} onChange={handleChange} className="field-control mt-2" placeholder="e.g. Dean of Alumni" />
              </div>
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="officialEmail">
                  Official Email *
                </label>
                <input id="officialEmail" name="officialEmail" type="email" value={formData.officialEmail} onChange={handleChange} className="field-control mt-2" />
              </div>
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="phone">
                  Phone Number *
                </label>
                <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="field-control mt-2" />
              </div>
              
              <div className="sm:col-span-2 mt-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="password">
                    Password *
                  </label>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="field-control mt-2" />
                
                {/* Live Password Checklist */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.7rem] font-medium tracking-wide">
                  <div className={`flex items-center gap-2 transition-colors ${passwordCriteria.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-sm">{passwordCriteria.length ? '✓' : '•'}</span> At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${passwordCriteria.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-sm">{passwordCriteria.uppercase ? '✓' : '•'}</span> One uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${passwordCriteria.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-sm">{passwordCriteria.lowercase ? '✓' : '•'}</span> One lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${passwordCriteria.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-sm">{passwordCriteria.number ? '✓' : '•'}</span> One number
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${passwordCriteria.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-sm">{passwordCriteria.special ? '✓' : '•'}</span> One special character
                  </div>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} className="field-control mt-2" />
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review & Submit</h3>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Please review your details before submitting your application.</p>
            
            <div className="space-y-4 mt-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Institute Information</h4>
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">Edit</button>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Name</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.instituteName}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Type</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.instituteType}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Location</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.address}, {formData.city}, {formData.state}, {formData.country}</dd>
                  </div>
                  {formData.website && (
                    <div className="sm:col-span-2">
                      <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Website</dt>
                      <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.website}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Administrator Information</h4>
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">Edit</button>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Name</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.adminName}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Designation</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.designation}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Official Email</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.officialEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">Phone</dt>
                    <dd className="font-medium text-slate-900 dark:text-slate-200">{formData.phone}</dd>
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
