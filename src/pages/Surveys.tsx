import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Target, ChevronRight, Brain, Lock, X, ClipboardList, ArrowRight } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useSettings } from '../context/SettingsContext';
import { useUsers } from '../context/UserContext';

export default function Surveys() {
  const { settings } = useSettings();
  const { currentUser } = useUsers();
  const navigate = useNavigate();
  const [showLockModal, setShowLockModal] = useState(false);
  
  const surveyProviders = settings.providers?.filter(p => p.type === 'survey' && p.active).sort((a, b) => a.order - b.order) || [];

  const handleOpenProvider = (slug: string) => {
    if (!currentUser?.profileSurveyCompleted) {
      setShowLockModal(true);
      return;
    }
    navigate(`/surveys/${slug}`);
  };

  return (
    <UserLayout title="Surveys">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h2 className="text-3xl font-black text-theme-text tracking-tight font-display mb-2">Surveys</h2>
          <p className="text-theme-text-muted font-medium">Answer questions and share your opinions to earn rewards.</p>
        </div>

        {surveyProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveyProviders.map((provider, i) => {
              const Icon = Brain;
              const isLocked = !currentUser?.profileSurveyCompleted;

              return (
                <div key={provider.slug || i} className="group relative bg-theme-surface border border-theme-border rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {isLocked && (
                    <div className="absolute top-6 right-6 w-8 h-8 bg-theme-bg rounded-full flex items-center justify-center text-theme-text-muted border border-theme-border z-20">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-theme-bg flex items-center justify-center text-theme-text shadow-sm border border-theme-border group-hover:scale-110 transition-transform">
                      {provider.logoUrl ? (
                         <img src={provider.logoUrl} alt={provider.name} className={`w-full h-full object-contain p-2 ${isLocked && 'grayscale opacity-50'}`} />
                      ) : (
                         <Icon className="w-7 h-7" />
                      )}
                    </div>
                    {provider.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-theme-text mb-2 group-hover:text-primary transition-colors">{provider.name}</h3>
                  <p className="text-sm font-medium text-theme-text-muted mb-8 flex-1 leading-relaxed">{provider.description}</p>
                  <button 
                    onClick={() => handleOpenProvider(provider.slug)}
                    className="w-full py-3.5 bg-theme-bg group-hover:bg-primary text-theme-text-muted group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-theme-border group-hover:border-primary shadow-sm"
                  >
                    {isLocked ? 'Complete Profile' : 'Open'} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-theme-surface border text-center border-theme-border rounded-[2rem] shadow-sm flex flex-col items-center py-20 px-4">
             <Target className="w-12 h-12 text-theme-text-muted opacity-30 mb-4" />
             <h3 className="text-xl font-bold text-theme-text mb-2">No Surveys Available</h3>
             <p className="text-theme-text-muted text-sm">Please check back later or contact support if you believe this is an error.</p>
          </div>
        )}
      </motion.div>

      {/* Profile Survey Lock Modal */}
      <AnimatePresence>
        {showLockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-theme-surface rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden border border-theme-border"
            >
              <button 
                onClick={() => setShowLockModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-theme-bg transition-colors"
              >
                <X className="w-5 h-5 text-theme-text-muted" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-primary/20 shadow-sm shadow-primary/10">
                  <ClipboardList className="w-10 h-10 text-primary" />
                </div>

                <h3 className="text-2xl font-black text-theme-text mb-2 leading-tight">
                  Complete Profile Survey First
                </h3>
                <p className="text-theme-text-muted font-medium mb-8">
                  To access survey opportunities you must complete your Profile Survey. It only takes 2 minutes!
                </p>

                <div className="flex flex-col w-full gap-3">
                  <Link 
                    to="/profile-survey"
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Go To Profile Survey <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => setShowLockModal(false)}
                    className="w-full py-4 bg-theme-bg text-theme-text-muted rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-theme-border transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}
