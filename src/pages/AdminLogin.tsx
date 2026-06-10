import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useUsers } from '../context/UserContext';
import { 
  ShieldCheck, 
  ArrowLeft,
  Lock,
  ChevronRight,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminLogin() {
  const { settings } = useSettings();
  const { login, currentUser, isLoading } = useUsers();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('banned') === 'true') {
      setAuthError('Account Banned: Your account has been banned and access has been restricted. If you believe this is a mistake, please contact support.');
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (currentUser?.isAdmin) {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        navigate(redirect || '/admin/dashboard');
      }
    }
  }, [currentUser, isLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!formData.email || !formData.password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    
    setIsSubmitting(true);
    const res = await login(formData.email, formData.password);
    
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed');
    }
  };

  if (isLoading || isSubmitting) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // If user is logged in but not admin
  if (currentUser && !currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="w-full max-w-sm relative z-10 text-center">
          <div className="bg-[#151B28]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">Access Restricted</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              You do not have administrator permissions to access this portal.
            </p>
            <Link 
              to="/dashboard"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.2)] transition-all flex items-center justify-center group uppercase text-sm"
            >
              Return to Dashboard
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a2333_0%,#0B0F1A_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6"
          >
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display mb-2">{settings.name} Authority</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest italic tracking-wider">Access Verification</p>
        </div>

        <div className="bg-[#151B28]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Identity</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none text-white transition-all focus:bg-white/10 focus:border-indigo-500/50 placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none text-white transition-all focus:bg-white/10 focus:border-indigo-500/50 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 text-center"
                >
                  {authError}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.2)] transition-all flex items-center justify-center group uppercase text-sm tracking-widest mt-4"
            >
              Verify & Enter
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <Link 
          to="/"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors mx-auto mt-10 font-bold text-xs w-fit tracking-[0.2em] uppercase"
        >
          <ArrowLeft className="w-3 h-3" />
          Exit Portal
        </Link>
      </motion.div>

      <div className="absolute bottom-6 text-[10px] text-slate-800 font-bold tracking-[0.3em] font-mono text-center w-full px-6 uppercase">
        Secure Infrastructure • Node_V92
      </div>
    </div>
  );
}
