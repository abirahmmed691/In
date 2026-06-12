import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Wallet, 
  User, 
  ChevronRight,
  Gift,
  ArrowRight,
  PlayCircle,
  Target,
  Zap,
  FlaskConical,
  Brain
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTransactions } from '../context/TransactionContext';
import { useUsers } from '../context/UserContext';
import UserLayout from '../components/UserLayout';
import UserAvatar from '../components/UserAvatar';

export default function UserDashboard() {
  const { settings } = useSettings();
  const { transactions } = useTransactions();
  const { currentUser } = useUsers();

  const userTransactions = useMemo(() => {
    if (!currentUser) return [];
    return transactions.filter(t => t.userId === currentUser.id);
  }, [transactions, currentUser]);

  const surveyProviders = settings.providers?.filter(p => p.type === 'survey' && p.active).sort((a, b) => a.order - b.order) || [];
  const offerwallProviders = settings.providers?.filter(p => p.type === 'offerwall' && p.active).sort((a, b) => a.order - b.order) || [];

  const completedSurveys = useMemo(() => userTransactions.filter(t => t.type === 'Survey Reward' && (t.status === 'Completed' || t.status === 'Approved')).length, [userTransactions]);
  const completedOffers = useMemo(() => userTransactions.filter(t => t.type === 'Offer Reward' && (t.status === 'Completed' || t.status === 'Approved')).length, [userTransactions]);
  const approvedWithdrawals = useMemo(() => userTransactions.filter(t => t.type === 'Withdrawal Request' && t.status === 'Approved').length + userTransactions.filter(t => t.type === 'Withdrawal Approval').length, [userTransactions]);

  const recentActivities = useMemo(() => {
    return userTransactions.slice(0, 10).map((tx) => {
      let iconColor = 'bg-theme-bg0';
      if (tx.type === 'Survey Reward') iconColor = 'bg-blue-600';
      if (tx.type === 'Offer Reward') iconColor = 'bg-emerald-500';
      if (tx.type === 'Withdrawal Request' || tx.type === 'Withdrawal Approval') iconColor = 'bg-[#003087]';
      if (tx.type === 'Withdrawal Rejection') iconColor = 'bg-red-500';
      if (tx.type === 'Manual Credit') iconColor = 'bg-green-500';
      if (tx.type === 'Manual Debit') iconColor = 'bg-amber-500';

      // Find provider logo globally 
      const providerInfo = settings.providers?.find(p => p.name === tx.providerName);
      const paymentInfo = settings.paymentMethods?.find(p => p.name === tx.providerName);
      const logoUrl = tx.providerLogo || providerInfo?.logoUrl || paymentInfo?.logo;

      // format amount
      let formattedAmount = '';
      if (tx.amount > 0) formattedAmount = `+$${tx.amount.toFixed(2)}`;
      else formattedAmount = `-$${Math.abs(tx.amount).toFixed(2)}`;
      if (tx.type === 'Withdrawal Request') {
        formattedAmount = `$${Math.abs(tx.amount).toFixed(2)}`; // usually positive representation for history or negative depending on design
      }

      const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
      };

      return {
        type: tx.type,
        providerName: tx.providerName || 'System',
        providerLogo: logoUrl,
        amount: formattedAmount,
        time: timeAgo(tx.date),
        status: tx.status,
        fallbackColor: iconColor
      };
    });
  }, [userTransactions, settings.providers, settings.paymentMethods]);

  return (
    <UserLayout title="Overview">
      <div className="space-y-10">
        {!currentUser?.profileSurveyCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary rounded-[2rem] p-6 shadow-xl shadow-primary/20 relative overflow-hidden group"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-full bg-theme-surface/10 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-700" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
                <div className="w-12 h-12 bg-theme-surface/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-inner shrink-0">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl font-black text-white tracking-tight">Complete Your Profile Survey</h3>
                  <p className="text-white/80 font-medium text-sm">
                    Complete your profile to unlock high-paying survey providers and get payments.
                  </p>
                </div>
              </div>
              <Link 
                to="/profile-survey"
                className="px-7 py-3.5 bg-theme-surface text-primary rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-theme-bg transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
              >
                Complete Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
        {/* SECTION 4 — Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Completed Offers', value: completedOffers.toString(), icon: Gift },
            { label: 'Completed Surveys', value: completedSurveys.toString(), icon: ClipboardList },
            { label: 'Approved Withdrawals', value: approvedWithdrawals.toString(), icon: Wallet },
            { label: 'Account Level', value: 'Starter', icon: User }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
                className="bg-theme-surface border border-theme-border rounded-[1.5rem] p-6 hover:border-primary/30 transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <p className="text-xs font-bold text-theme-text-muted uppercase tracking-widest">{stat.label}</p>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-theme-text tracking-tight relative z-10">{stat.value}</p>
                {/* Decorative background accent */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* SECTION 2 — Provider Overview */}
          <div className="xl:col-span-2 space-y-10">
            
            {/* Top Offer Providers */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-theme-text tracking-tight font-display">Top Offer Providers</h2>
                <Link to="/offers" className="text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-widest transition-colors flex items-center gap-1 group">
                  View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {offerwallProviders.slice(0, 3).map((provider: any, i: number) => {
                  const Icon = Target;
                  return (
                    <div key={provider.slug || i} className="bg-theme-surface border border-theme-border rounded-[1.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl border ${'bg-theme-bg text-theme-text-muted border-theme-border'} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform overflow-hidden`}>
                          {provider.logoUrl ? (
                            <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-2" />
                          ) : (
                            <Icon className="w-7 h-7" />
                          )}
                        </div>
                        {provider.featured ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-[10px] font-bold uppercase tracking-widest">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-theme-text mb-2 group-hover:text-primary transition-colors">{provider.name}</h3>
                      <p className="text-sm font-medium text-theme-text-muted mb-8 flex-1 leading-relaxed">{provider.description}</p>
                      <Link to={`/offers/${provider.slug}`} className="w-full py-3.5 bg-theme-bg group-hover:bg-primary text-theme-text-muted group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-theme-border group-hover:border-primary shadow-sm">
                        Open <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Top Survey Providers */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-theme-text tracking-tight font-display">Top Survey Providers</h2>
                <Link to="/surveys" className="text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-widest transition-colors flex items-center gap-1 group">
                  View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveyProviders.slice(0, 3).map((provider: any, i: number) => {
                  const Icon = Brain;
                  return (
                    <div key={provider.slug || i} className="bg-theme-surface border border-theme-border rounded-[1.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl border ${'bg-theme-bg text-theme-text-muted border-theme-border'} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform overflow-hidden`}>
                          {provider.logoUrl ? (
                            <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain p-2" />
                          ) : (
                            <Icon className="w-7 h-7" />
                          )}
                        </div>
                        {provider.featured ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-[10px] font-bold uppercase tracking-widest">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-theme-text mb-2 group-hover:text-primary transition-colors">{provider.name}</h3>
                      <p className="text-sm font-medium text-theme-text-muted mb-8 flex-1 leading-relaxed">{provider.description}</p>
                      <Link to={`/surveys/${provider.slug}`} className="w-full py-3.5 bg-theme-bg group-hover:bg-primary text-theme-text-muted group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-theme-border group-hover:border-primary shadow-sm">
                        Open <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* SECTION 3 — Recent Activity */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-theme-surface border border-theme-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse"></div>
                  <h2 className="text-xl font-black text-theme-text tracking-tight font-display">Recent Activity</h2>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="space-y-0 relative">
                  {recentActivities.length > 0 ? recentActivities.map((activity, i) => {
                    return (
                      <div key={i} className={`relative flex items-center gap-4 py-3 group ${i !== recentActivities.length - 1 ? 'border-b border-theme-border' : ''}`}>
                        {/* User Avatar with Provider Badge */}
                        <div className="relative shrink-0">
                          <UserAvatar 
                            avatarId={currentUser?.avatarId || null} 
                            size="md" 
                            fallbackName={currentUser?.fullName}
                            className="rounded-[12px] border border-theme-border shadow-sm"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center border-2 border-theme-surface shadow-sm overflow-hidden ${activity.providerLogo ? 'bg-theme-surface' : activity.fallbackColor}`}>
                            {activity.providerLogo ? (
                              <img src={activity.providerLogo} alt={activity.providerName} className="w-full h-full object-contain p-0.5" />
                            ) : (
                              <span className="text-[8px] font-black text-white">{activity.providerName.substring(0, 1)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-0.5">
                            <p className="text-sm font-bold text-theme-text truncate pr-2">{activity.type}</p>
                            <p className={`text-sm font-black shrink-0 ${activity.type.includes('Withdrawal') ? 'text-theme-text' : 'text-green-600'}`}>{activity.amount}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-theme-text-muted truncate">
                              {activity.providerName}
                            </p>
                            <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider shrink-0 flex items-center">
                              {activity.time}
                              {activity.status === 'Pending' && (
                                <span className="text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 ml-2">PENDING</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="py-8 text-center text-theme-text-muted text-sm font-medium">No recent activity yet.</div>
                  )}
                </div>
              </div>
              
              <button className="relative z-10 w-full mt-8 py-3.5 border border-theme-border text-theme-text-muted hover:text-theme-text rounded-xl text-xs font-bold hover:bg-theme-bg transition-colors uppercase tracking-widest font-medium">
                View Full Feed
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}

