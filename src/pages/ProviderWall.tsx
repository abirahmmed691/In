import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Layers, ShieldAlert, ShieldCheck, Loader2, PlayCircle, ExternalLink } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useSettings } from '../context/SettingsContext';
import { useUsers } from '../context/UserContext';

export default function ProviderWall() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { currentUser } = useUsers();
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const provider = settings.providers?.find(p => p.slug === providerId);

  // Replace [USER_ID] with the dynamic user UUID
  const iframeUrl = provider?.iframeUrl?.replace('[USER_ID]', currentUser?.id || '');
  const providerUrl = provider?.providerUrl?.replace('[USER_ID]', currentUser?.id || '');

  if (!provider) {
    return (
      <UserLayout title="Provider Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <ShieldAlert className="w-16 h-16 text-red-500/80 mb-4" />
          <h2 className="text-2xl font-black text-theme-text mb-2">Provider Not Found</h2>
          <p className="text-theme-text-muted mb-6 font-medium">The provider you're looking for doesn't exist or is currently unavailable.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-theme-surface border border-theme-border text-theme-text rounded-xl font-bold uppercase tracking-widest text-xs transition-colors hover:bg-theme-bg"
          >
            Go Back
          </button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout title={provider.name}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-5xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-theme-surface border border-theme-border rounded-xl flex items-center justify-center text-theme-text-muted hover:text-theme-text hover:bg-theme-bg transition-all shadow-sm shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-theme-text tracking-tight font-display">{provider.name}</h2>
            <span className={`px-2 py-1 ${provider.active ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'} border rounded-md text-[10px] font-bold uppercase tracking-widest shrink-0`}>
              {provider.active ? 'Active' : 'Offline'}
            </span>
          </div>
        </div>

        {!hasStarted ? (
          <div className="bg-theme-surface border border-theme-border rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-12 relative">
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-theme-bg/50 to-transparent"></div>
             
             <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="w-28 h-28 bg-theme-surface border border-theme-border rounded-[2rem] flex items-center justify-center shadow-lg mb-8 p-5">
                  {provider.logoUrl ? (
                    <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                  ) : (
                    <Layers className="w-12 h-12 text-theme-text-muted opacity-30" />
                  )}
                </div>

                <p className="text-lg text-theme-text-muted font-medium mb-10 leading-relaxed">
                  {provider.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setHasStarted(true)}
                    disabled={!provider.active}
                    className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-lg min-w-[200px] w-full sm:w-auto ${provider.active ? 'bg-primary text-white hover:bg-primary/90 hover:-translate-y-1' : 'bg-theme-bg text-theme-text-muted cursor-not-allowed border border-theme-border'}`}
                  >
                    <PlayCircle className="w-5 h-5" />
                    {provider.active ? 'Start Earning' : 'Currently Offline'}
                  </button>

                  {providerUrl && (
                    <a 
                      href={providerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-4 bg-theme-surface border border-theme-border text-theme-text rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-theme-bg hover:-translate-y-1 transition-all shadow-sm min-w-[200px] w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>

                <div className="mt-12 inline-flex items-start gap-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-left w-full sm:w-auto max-w-lg">
                   <ShieldCheck className="w-7 h-7 text-blue-600 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">Secure Connection</p>
                     <p className="text-xs text-blue-700/80 dark:text-blue-300/80 font-medium leading-relaxed">Your account ID and progress are securely synchronized. Please use genuine information to prevent account suspension.</p>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-theme-surface border border-theme-border rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col w-full relative" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
            {isLoading && iframeUrl && (
              <div className="absolute inset-0 bg-theme-surface/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-theme-text font-bold tracking-widest uppercase text-xs">Loading Provider...</p>
              </div>
            )}
            
            {iframeUrl ? (
              <iframe 
                 src={iframeUrl} 
                 title={`${provider.name} iframe`} 
                 onLoad={() => setIsLoading(false)}
                 className="w-full h-full border-none absolute inset-0 z-0 bg-theme-bg"
                 allow="camera; microphone; geolocation"
                 loading="lazy"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-theme-bg text-center z-0 h-full">
                <Layers className="w-16 h-16 text-theme-text-muted opacity-30 mb-6" />
                <h3 className="text-2xl font-bold text-theme-text mb-2">Integration Not Found</h3>
                <p className="text-theme-text-muted font-medium max-w-md mx-auto">This provider is active but its integration link has not been configured by the administrator yet.</p>
                <button 
                  onClick={() => setHasStarted(false)}
                  className="mt-8 px-6 py-3 bg-theme-surface border border-theme-border text-theme-text rounded-xl font-bold uppercase tracking-widest text-xs transition-colors hover:bg-theme-bg"
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </UserLayout>
  );
}
