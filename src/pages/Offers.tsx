import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Target, ChevronRight, PlayCircle } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useSettings } from '../context/SettingsContext';

export default function Offers() {
  const { settings } = useSettings();
  
  const offerwallProviders = settings.providers?.filter(p => p.type === 'offerwall' && p.active).sort((a, b) => a.order - b.order) || [];

  return (
    <UserLayout title="Offerwalls">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight font-display mb-2">Offerwalls</h2>
          <p className="text-gray-500 font-medium">Complete tasks, play games, and discover new apps to earn.</p>
        </div>

        {offerwallProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerwallProviders.map((provider, i) => {
              const Icon = PlayCircle;
              return (
                <div key={provider.slug || i} className="group relative bg-white border border-gray-200 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                      {provider.logoUrl ? (
                         <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-2" />
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{provider.name}</h3>
                  <p className="text-sm font-medium text-gray-500 mb-8 flex-1 leading-relaxed">{provider.description}</p>
                  <Link to={`/offers/${provider.slug}`} className="w-full py-3.5 bg-gray-50 group-hover:bg-primary text-gray-600 group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-gray-100 group-hover:border-primary shadow-sm">
                    Open <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border text-center border-gray-200 rounded-[2rem] shadow-sm flex flex-col items-center py-20 px-4">
             <Target className="w-12 h-12 text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 mb-2">No Offerwalls Available</h3>
             <p className="text-gray-500 text-sm">Please check back later or contact support if you believe this is an error.</p>
          </div>
        )}
      </motion.div>
    </UserLayout>
  );
}
