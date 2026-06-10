import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useUsers } from '../context/UserContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

type AuthMode = 'signup' | 'login' | 'reset';

export default function Auth() {
  const { settings } = useSettings();
  const { login, addUser, currentUser, isLoading: globalLoading } = useUsers();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>(
    location.pathname === '/login' ? 'login' : 
    location.pathname === '/forgot-password' ? 'reset' : 'signup'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetSubmitted, setResetSubmitted] = useState(false);

  useEffect(() => {
    if (!globalLoading && currentUser && currentUser.status !== 'Banned' && location.pathname !== '/forgot-password') {
       const params = new URLSearchParams(location.search);
       let redirect = params.get('redirect');
       
       // Prevent redirecting back to the homepage from auth if session is valid
       if (!redirect || redirect === '/' || redirect === '/login' || redirect === '/signup') {
           redirect = '/dashboard';
       }
       
       navigate(redirect);
    }
  }, [currentUser, globalLoading, navigate, location.pathname, location.search]);

  useEffect(() => {
    if (location.pathname === '/login') {
      setMode('login');
      setResetSubmitted(false);
      
      const params = new URLSearchParams(location.search);
      if (params.get('banned') === 'true') {
        setAuthError('Account Banned: Your account has been banned and access has been restricted. If you believe this is a mistake, please contact support.');
      }
    } else if (location.pathname === '/signup') {
      setMode('signup');
      setResetSubmitted(false);
    } else if (location.pathname === '/forgot-password') {
      setMode('reset');
    }
  }, [location.pathname]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    setAuthError(null);
    
    if (mode === 'signup') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms';
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (mode === 'signup' && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (globalLoading || (currentUser && currentUser.status !== 'Banned' && location.pathname !== '/forgot-password')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      const handleAuthTask = async () => {
        setIsLoading(true);
        try {
            if (mode === 'reset') {
            setResetSubmitted(true);
          } else if (mode === 'login') {
            const res = await login(formData.email, formData.password);
            if (!res.success) {
              setAuthError(res.error || 'Login failed');
            }
          } else if (mode === 'signup') {
             const res = await addUser({
               email: formData.email,
               password: formData.password,
               firstName: formData.firstName,
               lastName: formData.lastName,
               status: 'Active'
             });
             if (!res.success) {
               setAuthError(res.error || 'Registration failed');
             } else {
               // Let's login the newly created user right after registration
               await login(formData.email, formData.password);
             }
          }
        } catch (err: any) {
          setAuthError(err.message || 'An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
      };

      handleAuthTask();
    }
  };

  const benefits = [
    'Free Registration',
    'Daily Survey Opportunities',
    'Fast Withdrawals',
    'Trusted Research Partners'
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side: Promo Content (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-center px-16 xl:px-24">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-full h-full">
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-2xl uppercase">
                {settings.logoText}
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                {settings.name}
              </span>
            </Link>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.1] mb-6">
              Start Earning <br />
              <span className="text-primary">Rewards Today</span>
            </h1>
            
            <p className="text-xl text-gray-400 font-medium mb-10 max-w-lg leading-relaxed">
              {settings.tagline}
            </p>

            <div className="space-y-4 mb-16">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-white font-semibold"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Mock Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative p-1 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
            >
              <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="bg-gray-700 h-2 w-32 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 h-24 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 mb-3" />
                    <div className="h-2 w-16 bg-gray-600 rounded-full" />
                  </div>
                  <div className="bg-gray-700/50 h-24 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-400/20 mb-3" />
                    <div className="h-2 w-16 bg-gray-600 rounded-full" />
                  </div>
                  <div className="col-span-2 bg-gray-700/50 h-32 rounded-xl p-4">
                    <div className="flex justify-between mb-4">
                      <div className="h-4 w-24 bg-gray-600 rounded-full" />
                      <div className="h-4 w-12 bg-primary/40 rounded-full" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-gray-600/50 rounded-full" />
                      <div className="h-2 w-4/5 bg-gray-600/50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 xl:p-24 bg-gray-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-orange-500/20 uppercase">
              {settings.logoText}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 font-display">
              {mode === 'signup' ? 'Create Account' : mode === 'login' ? 'Welcome Back' : 'Reset Password'}
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              {mode === 'signup' ? `Join ${settings.name} and start earning` : mode === 'login' ? `Log in to ${settings.name}` : "We'll send you a recovery link"}
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/[0.03] border border-gray-100">
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 font-display mb-2">
                {mode === 'signup' ? `Join ${settings.name}` : mode === 'login' ? 'Welcome Back' : 'Reset Your Password'}
              </h2>
              <p className="text-gray-500 font-medium">
                {mode === 'signup' ? 'Create your free account in seconds' : mode === 'login' ? `Log in to your ${settings.name} account` : "Enter your email for reset instructions"}
              </p>
            </div>

            {/* Tab Switcher */}
            {mode !== 'reset' && (
              <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 relative">
                <div 
                  className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ${mode === 'login' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
                />
                <button 
                  onClick={() => navigate('/signup')}
                  className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors ${mode === 'signup' ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors ${mode === 'login' ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  Log In
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {resetSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent</h3>
                    <p className="text-sm text-gray-500 mb-6">Check <span className="font-bold text-gray-800">{formData.email}</span> for reset instructions.</p>
                    <button 
                      type="button"
                      onClick={() => {
                        setResetSubmitted(false);
                        navigate('/login');
                      }} 
                      className="text-primary font-bold hover:underline text-sm"
                    >
                      Back to Log In
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {mode === 'signup' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-primary'}`}
                            />
                          </div>
                          {errors.firstName && <p className="text-xs text-red-500 ml-1 font-medium">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-primary'}`}
                            />
                          </div>
                          {errors.lastName && <p className="text-xs text-red-500 ml-1 font-medium">{errors.lastName}</p>}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-primary'}`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 ml-1 font-medium">{errors.email}</p>}
                    </div>

                    {mode !== 'reset' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                          <label className="text-sm font-bold text-gray-700">Password</label>
                          {mode === 'login' && (
                            <button 
                              type="button"
                              onClick={() => navigate('/forgot-password')} 
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              Forgot Password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-2xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-primary'}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 ml-1 font-medium">{errors.password}</p>}
                      </div>
                    )}

                    {authError && authError.includes('account has been banned') ? (
                      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-red-900 font-bold mb-1">Account Banned</h4>
                          <p className="text-red-700 text-sm leading-relaxed">
                            {authError}
                          </p>
                        </div>
                      </div>
                    ) : authError ? (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600 text-center">
                        {authError}
                      </div>
                    ) : null}

                    {mode === 'signup' && (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-2xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-primary'}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500 ml-1 font-medium">{errors.confirmPassword}</p>}
                      </div>
                    )}

                    {mode === 'signup' && (
                      <div className="flex items-start gap-3 py-2">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={formData.agreeTerms}
                            onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                            className="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 appearance-none bg-gray-50 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                          />
                          {formData.agreeTerms && <CheckCircle2 className="absolute pointer-events-none w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        </div>
                        <label htmlFor="terms" className="text-sm text-gray-500 font-medium cursor-pointer">
                          I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                    )}

                    {mode === 'login' && (
                      <div className="flex items-center gap-2 py-1">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-5 h-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 appearance-none bg-gray-50 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                          />
                          {rememberMe && <CheckCircle2 className="absolute pointer-events-none w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        </div>
                        <label htmlFor="remember" className="text-sm text-gray-500 font-medium cursor-pointer select-none">
                          Remember me
                        </label>
                      </div>
                    )}

                    {mode === 'signup' && errors.agreeTerms && <p className="text-xs text-red-500 ml-1 font-medium -mt-2">{errors.agreeTerms}</p>}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center group disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {mode === 'signup' ? 'Create Free Account' : mode === 'login' ? 'Log In' : 'Send Reset Link'}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {mode !== 'reset' && (
                      <>
                        <div className="relative py-4">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-gray-400 font-bold tracking-wider">or continue with</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                          {mode === 'signup' ? 'Sign up with Google' : 'Log In with Google'}
                        </button>
                      </>
                    )}

                    {mode === 'reset' && (
                      <button 
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors pt-2"
                      >
                        Back to Log In
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {!resetSubmitted && mode !== 'reset' && (
              <p className="text-center mt-8 text-gray-600 font-medium">
                {mode === 'signup' ? (
                  <>Already have an account? <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline">Log In</button></>
                ) : (
                  <>Don't have an account? <button onClick={() => navigate('/signup')} className="text-primary font-bold hover:underline">Create Free Account</button></>
                )}
              </p>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mx-auto mt-8 font-bold text-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
