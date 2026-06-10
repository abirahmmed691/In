import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Layers, ShieldAlert, ShieldCheck, Loader2, PlayCircle, ExternalLink } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useSettings } from '../context/SettingsContext';

export default function ProviderWall() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const provider = settings.providers?.find(p => p.slug === providerId);

  if (!provider) {
    return (
      <UserLayout title="Provider Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <ShieldAlert className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Provider Not Found</h2>
          <p className="text-gray-500 mb-6 font-medium">The provider you're looking for doesn't exist or is currently unavailable.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors hover:bg-gray-800"
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
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight font-display">{provider.name}</h2>
            <span className={`px-2 py-1 ${provider.active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'} border rounded-md text-[10px] font-bold uppercase tracking-widest shrink-0`}>
              {provider.active ? 'Active' : 'Offline'}
            </span>
          </div>
        </div>

        {!hasStarted ? (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-12 relative">
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
             
             <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="w-28 h-28 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center shadow-lg mb-8 p-5">
                  {provider.logoUrl ? (
                    <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                  ) : (
                    <Layers className="w-12 h-12 text-gray-300" />
                  )}
                </div>

                <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed">
                  {provider.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setHasStarted(true)}
                    disabled={!provider.active}
                    className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-lg min-w-[200px] w-full sm:w-auto ${provider.active ? 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-1' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
                  >
                    <PlayCircle className="w-5 h-5" />
                    {provider.active ? 'Start Earning' : 'Currently Offline'}
                  </button>

                  {provider.providerUrl && (
                    <a 
                      href={provider.providerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:-translate-y-1 transition-all shadow-sm min-w-[200px] w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>

                <div className="mt-12 inline-flex items-start gap-4 p-5 bg-blue-50 border border-blue-100 rounded-2xl text-left w-full sm:w-auto max-w-lg">
                   <ShieldCheck className="w-7 h-7 text-blue-600 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-bold text-blue-900 mb-1">Secure Connection</p>
                     <p className="text-xs text-blue-700/80 font-medium leading-relaxed">Your account ID and progress are securely synchronized. Please use genuine information to prevent account suspension.</p>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col w-full relative" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
            {isLoading && provider.iframeUrl && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-900 font-bold tracking-widest uppercase text-xs">Loading Provider...</p>
              </div>
            )}
            
            {provider.iframeUrl ? (
              <iframe 
                 src={provider.iframeUrl} 
                 title={`${provider.name} iframe`} 
                 onLoad={() => setIsLoading(false)}
                 className="w-full h-full border-none absolute inset-0 z-0 bg-gray-50"
                 allow="camera; microphone; geolocation"
                 loading="lazy"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 text-center z-0 h-full">
                <Layers className="w-16 h-16 text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Integration Not Found</h3>
                <p className="text-gray-500 font-medium max-w-md mx-auto">This provider is active but its integration link has not been configured by the administrator yet.</p>
                <button 
                  onClick={() => setHasStarted(false)}
                  className="mt-8 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors hover:bg-gray-50"
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
