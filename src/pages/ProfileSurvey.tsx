import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, GraduationCap, Briefcase, 
  DollarSign, Users, ChevronRight, ChevronLeft,
  CheckCircle2, Info, Laptop, ShoppingBag, Sparkles
} from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useUsers } from '../context/UserContext';
import { toast } from 'react-hot-toast';

const STEPS = [
  { id: 'personal', title: 'Personal', icon: User },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'employment', title: 'Life', icon: Briefcase },
  { id: 'household', title: 'Household', icon: Users },
  { id: 'preferences', title: 'Interests', icon: ShoppingBag },
  { id: 'review', title: 'Review', icon: CheckCircle2 }
];

export default function ProfileSurvey() {
  const { currentUser, submitProfileSurvey } = useUsers();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    gender: '',
    dob: '',
    country: 'United States',
    state: '',
    city: '',
    education: '',
    employmentStatus: '',
    industry: '',
    incomeRange: '',
    maritalStatus: '',
    childrenCount: '',
    devices: [] as string[],
    interests: [] as string[],
    shoppingHabits: [] as string[]
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitProfileSurvey(formData);
      toast.success('Profile Survey completed! You have unlocked all providers.');
      navigate('/surveys');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit profile survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayItem = (field: 'devices' | 'interests' | 'shoppingHabits', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-theme-text">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-theme-text">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`py-4 rounded-2xl font-bold transition-all border ${formData.gender === g ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-theme-bg text-theme-text-muted border-theme-border hover:bg-theme-surface-hover'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Date of Birth</label>
              <input 
                type="date" 
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Country</label>
              <select 
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-theme-text">State / Region</label>
                <input 
                  type="text" 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-theme-text">City</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Education Level</label>
              <select 
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
              >
                <option value="">Select Level</option>
                <option>High School</option>
                <option>Associate Degree</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>Doctorate</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Employment Status</label>
              <select 
                value={formData.employmentStatus}
                onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
              >
                <option value="">Select Status</option>
                <option>Employed Full-Time</option>
                <option>Employed Part-Time</option>
                <option>Self-Employed</option>
                <option>Unemployed</option>
                <option>Student</option>
                <option>Retired</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Industry</label>
              <input 
                type="text" 
                placeholder="e.g. Technology, Healthcare, Finance"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Annual Household Income</label>
              <select 
                value={formData.incomeRange}
                onChange={(e) => setFormData({...formData, incomeRange: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
              >
                <option value="">Select Range</option>
                <option>Under $25,000</option>
                <option>$25,000 - $49,999</option>
                <option>$50,000 - $74,999</option>
                <option>$75,000 - $99,999</option>
                <option>$100,000 - $149,999</option>
                <option>$150,000+</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Marital Status</label>
              <select 
                value={formData.maritalStatus}
                onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
              >
                <option value="">Select Status</option>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-theme-text">Number of Children</label>
              <select 
                value={formData.childrenCount}
                onChange={(e) => setFormData({...formData, childrenCount: e.target.value})}
                className="w-full bg-theme-bg border border-theme-border rounded-2xl px-5 py-4 focus:bg-theme-surface focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
              >
                <option value="">Select Option</option>
                <option>None</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-theme-text flex items-center gap-2">
                <Laptop className="w-4 h-4 text-primary" /> Devices You Use
              </label>
              <div className="flex flex-wrap gap-2">
                {['Smartphone', 'Laptop', 'Desktop', 'Tablet', 'Smart Watch', 'Gaming Console'].map(d => (
                  <button
                    key={d}
                    onClick={() => toggleArrayItem('devices', d)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formData.devices.includes(d) ? 'bg-primary/10 border-primary text-primary' : 'bg-theme-bg border-theme-border text-theme-text-muted'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-theme-text flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Fashion', 'Gaming', 'Travel', 'Cooking', 'Fitness', 'Automotive', 'Investing', 'Movies', 'Music'].map(i => (
                  <button
                    key={i}
                    onClick={() => toggleArrayItem('interests', i)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formData.interests.includes(i) ? 'bg-primary/10 border-primary text-primary' : 'bg-theme-bg border-theme-border text-theme-text-muted'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-theme-text flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" /> Shopping Habits
              </label>
              <div className="flex flex-wrap gap-2">
                {['Online Shopping', 'In-Store', 'Groceries', 'Luxury Goods', 'Electronics', 'Home Decor'].map(s => (
                  <button
                    key={s}
                    onClick={() => toggleArrayItem('shoppingHabits', s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formData.shoppingHabits.includes(s) ? 'bg-primary/10 border-primary text-primary' : 'bg-theme-bg border-theme-border text-theme-text-muted'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
              <h4 className="text-lg font-black text-theme-text mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Review Your Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { label: 'Full Name', value: `${formData.firstName} ${formData.lastName}` },
                  { label: 'Age', value: formData.dob ? `${new Date().getFullYear() - new Date(formData.dob).getFullYear()} years old` : 'Not set' },
                  { label: 'Location', value: `${formData.city}, ${formData.state}, ${formData.country}` },
                  { label: 'Employment', value: formData.employmentStatus },
                  { label: 'Income', value: formData.incomeRange },
                  { label: 'Household', value: `${formData.maritalStatus}${formData.childrenCount !== 'None' ? `, ${formData.childrenCount} kids` : ''}` }
                ].map(item => (
                  <div key={item.label} className="space-y-1">
                    <p className="text-[10px] font-black text-theme-text-muted opacity-60 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-theme-text">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-primary/10 grid grid-cols-1 gap-6">
                 <div>
                    <p className="text-[10px] font-black text-theme-text-muted opacity-60 uppercase tracking-widest mb-2">Interests & Devices</p>
                    <div className="flex flex-wrap gap-2">
                       {[...formData.devices, ...formData.interests].slice(0, 8).map(tag => (
                         <span key={tag} className="px-3 py-1 bg-theme-surface border border-primary/20 rounded-full text-[10px] font-bold text-primary">
                           {tag}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
            <p className="text-center text-xs text-theme-text-muted font-medium px-4">
              By submitting, you confirm that the information provided is accurate and will be used to match you with better survey opportunities.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4" /> Unlocking Opportunities
          </motion.div>
          <h1 className="text-4xl font-black text-theme-text mb-4 tracking-tight">Complete Profile Survey</h1>
          <p className="text-theme-text-muted font-medium max-w-lg mx-auto">
            Answer a few questions about yourself to unlock high-paying survey providers and get better matches.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-theme-surface border border-theme-border rounded-[2.5rem] p-6 mb-8 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] px-4">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    index <= currentStep ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-theme-bg text-theme-text-muted opacity-60 border border-theme-border'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    index <= currentStep ? 'text-primary' : 'text-theme-text-muted opacity-60'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-theme-surface-hover mx-4 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: index < currentStep ? '100%' : '0%' }}
                      className="absolute inset-0 bg-primary"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-theme-surface border border-theme-border rounded-[2.5rem] shadow-xl shadow-gray-200/20 overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-10 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-theme-text tracking-tight">
                    {STEPS[currentStep].title} Details
                  </h3>
                  <p className="text-theme-text-muted font-medium text-sm mt-1">Step {currentStep + 1} of {STEPS.length}</p>
                </div>
                
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-8 bg-theme-bg border-t border-theme-border flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                currentStep === 0 ? 'opacity-0 cursor-default' : 'bg-theme-surface text-theme-text-muted border border-theme-border hover:bg-theme-surface-hover'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {currentStep === STEPS.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Submit Profile <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-10 py-4 bg-theme-text text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gray-900/10 hover:scale-105 active:scale-95 transition-all"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
