import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { User, Activity, Award, Gift, ClipboardList, Wallet, Edit2, ShieldAlert, List, Settings as SettingsIcon, Check, ChevronRight } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useTransactions } from '../context/TransactionContext';
import { useUsers } from '../context/UserContext';
import UserAvatar from '../components/UserAvatar';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { balance, transactions } = useTransactions();
  const { currentUser } = useUsers();
  const [isCopied, setIsCopied] = useState(false);
  
  const referralLink = useMemo(() => {
    if (!currentUser) return '';
    return `https://reware.app/ref/${currentUser.id}`;
  }, [currentUser]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      
      // Prevent duplicate toasts by dismissing previous ones
      toast.dismiss();
      toast.success('Referral link copied successfully.');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Unable to copy link.');
      console.error('Failed to copy: ', err);
    }
  };

  const userTransactions = useMemo(() => {
    if (!currentUser) return [];
    return transactions.filter(t => t.userId === currentUser.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentUser]);

  if (!currentUser) return null;

  return (
    <UserLayout title="Profile">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            <div className="relative group">
              <UserAvatar 
                avatarId={currentUser.avatarId} 
                size="xl" 
                fallbackName={currentUser.fullName}
                className="rounded-3xl border-2 border-white shadow-md"
              />
              {!currentUser.hasSelectedAvatar && (
                <Link to="/settings" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-primary transition-colors hover:scale-110">
                  <Edit2 className="w-4 h-4" />
                </Link>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight font-display mb-1">{currentUser.fullName}</h2>
              <p className="text-gray-500 font-medium mb-4">{currentUser.email}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Starter Level
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md text-[10px] font-bold uppercase tracking-widest">
                  Account Verified
                </span>
              </div>
            </div>
            
            <div className="w-full md:w-auto bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between gap-8 mt-6 md:mt-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Earned</span>
                <span className="text-2xl font-black text-green-600">${balance.lifetime.toFixed(2)}</span>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Referrals</span>
                <span className="text-2xl font-black text-gray-900">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Link & Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Your Referral Link
              </h3>
              <p className="text-gray-500 text-sm font-medium mb-6">Invite friends and earn 5% of their lifetime earnings!</p>
              
              <div className="mt-auto">
                <div className="flex flex-col gap-2 mb-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={referralLink} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className={`w-full px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                  >
                    {isCopied ? (
                      <>Copied <Check className="w-3.5 h-3.5" /> </>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Survey Card */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gray-400" />
                Profile Survey
              </h3>
              <p className="text-gray-500 text-sm font-medium mb-6">Complete your profile to unlock all survey providers and receive better matched surveys.</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                  {currentUser.profileSurveyCompleted ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3 h-3" /> Completed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider">
                      Not Completed
                    </span>
                  )}
                </div>

                {currentUser.profileSurveyCompleted ? (
                  <button 
                    disabled
                    className="w-full px-6 py-4 bg-gray-50 text-gray-400 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-gray-100 flex items-center justify-center gap-2"
                  >
                    Profile Survey Submitted
                  </button>
                ) : (
                  <Link 
                    to="/profile-survey"
                    className="w-full px-6 py-4 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Start Profile Survey <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <List className="w-5 h-5 text-gray-400" />
                  Transaction History
                </h3>
              </div>
              
              <div className="flex-1 overflow-auto -mx-4 px-4 max-h-[500px]">
                {userTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {userTransactions.map((tx) => (
                      <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{tx.type}</span>
                          <span className="text-xs font-medium text-gray-500 mt-0.5">
                            {tx.providerName && <span>{tx.providerName} • </span>}
                            {new Date(tx.date).toLocaleDateString()}
                            {tx.note && <span> • {tx.note}</span>}
                          </span>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <span className={`font-black text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                          </span>
                          <span className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${
                            tx.status === 'Completed' || tx.status === 'Approved' ? 'text-green-600' :
                            tx.status === 'Pending' ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <List className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No transactions found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </UserLayout>
  );
}
