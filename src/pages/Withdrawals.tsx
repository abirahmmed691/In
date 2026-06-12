import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ChevronRight, CheckCircle2, Copy, X, ArrowRight, Sparkles, Clock } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useSettings } from '../context/SettingsContext';
import { useTransactions } from '../context/TransactionContext';
import { useUsers } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Withdrawals() {
  const { settings } = useSettings();
  const { balance, transactions, addTransaction } = useTransactions();
  const { currentUser } = useUsers();
  const navigate = useNavigate();
  const historyRef = useRef<HTMLDivElement>(null);
  
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastWithdrawal, setLastWithdrawal] = useState<{ method: string, amount: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdrawStart = (methodName: string) => {
    setSelectedMethod(methodName);
    setWithdrawAmount('');
    setWithdrawDetails('');
  };

  const submitWithdrawal = async () => {
    if (!currentUser) return;

    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount < 5) {
      toast.error('Minimum withdrawal is $5.00');
      return;
    }
    
    if (amount > balance.available) {
      toast.error('Insufficient available balance');
      return;
    }

    if (!selectedMethod) return;
    
    setIsSubmitting(true);
    try {
      // Store details for success screen BEFORE clearing state
      const method = selectedMethod;
      setLastWithdrawal({
        method: method,
        amount: amount.toFixed(2)
      });

      await addTransaction({
        userId: currentUser.id,
        type: 'Withdrawal Request',
        amount: -amount,
        withdrawalMethod: method,
        status: 'Pending',
        note: withdrawDetails
      });
      
      // Close form and show success
      setSelectedMethod(null);
      setShowSuccess(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToHistory = () => {
    setShowSuccess(false);
    setTimeout(() => {
      historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const withdrawalHistory = useMemo(() => {
    if (!currentUser) return [];
    return transactions.filter(t => t.userId === currentUser.id && (t.type === 'Withdrawal Request' || t.type === 'Withdrawal Approval' || t.type === 'Withdrawal Rejection'));
  }, [transactions, currentUser]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <UserLayout title="Withdrawals">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-theme-text tracking-tight font-display mb-2">Withdraw Rewards</h2>
            <p className="text-theme-text-muted font-medium">Select a payment method to cash out your available balance.</p>
          </div>
          <div className="bg-theme-surface px-6 py-4 rounded-2xl border border-theme-border shadow-sm flex items-center gap-6">
            <div>
              <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest mb-1">Available to Withdraw</p>
              <p className="text-2xl font-black text-theme-text leading-none">${balance.available.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(settings.paymentMethods || []).filter(pm => pm.enabled).map((method) => (
            <div key={method.id} onClick={() => handleWithdrawStart(method.name)} className="bg-theme-surface border border-theme-border rounded-[1.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-3xl bg-theme-bg border border-theme-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden p-4 shadow-inner relative z-10">
                {method.logo ? (
                  <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                ) : (
                  <Wallet className="w-8 h-8 text-theme-text-muted" />
                )}
              </div>
              <h3 className="text-lg font-bold text-theme-text mb-1 group-hover:text-primary transition-colors relative z-10">{method.name}</h3>
              <p className="text-xs text-theme-text-muted font-medium relative z-10 mb-6">Min. $5.00</p>
              
              <button className="w-full py-3.5 bg-theme-bg group-hover:bg-primary text-theme-text-muted group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-theme-border group-hover:border-primary shadow-sm relative z-10">
                Select <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
              
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
          
          {(!settings.paymentMethods || settings.paymentMethods.length === 0) && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-theme-border rounded-3xl bg-theme-bg flex flex-col items-center">
              <Wallet className="w-12 h-12 text-theme-text-muted opacity-30 mb-4" />
              <p className="text-theme-text-muted font-bold uppercase tracking-widest text-xs">No payment methods available</p>
            </div>
          )}
        </div>

        {/* Withdrawal History */}
        <div ref={historyRef} className="bg-theme-surface border border-theme-border rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-xl font-bold text-theme-text mb-6">Withdrawal History</h3>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-4 text-xs font-bold text-theme-text-muted uppercase tracking-widest border-b border-theme-border">Method</th>
                  <th className="pb-4 text-xs font-bold text-theme-text-muted uppercase tracking-widest border-b border-theme-border">Amount</th>
                  <th className="pb-4 text-xs font-bold text-theme-text-muted uppercase tracking-widest border-b border-theme-border">Date</th>
                  <th className="pb-4 text-xs font-bold text-theme-text-muted uppercase tracking-widest border-b border-theme-border text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {withdrawalHistory.map((wd, i) => (
                  <tr key={wd.id} className="group hover:bg-theme-bg/50">
                    <td className="py-4 border-b border-theme-border font-bold text-theme-text">
                      {wd.withdrawalMethod || wd.providerName || '-'}
                    </td>
                    <td className="py-4 border-b border-theme-border font-bold text-theme-text">${Math.abs(wd.amount).toFixed(2)}</td>
                    <td className="py-4 border-b border-theme-border text-theme-text-muted">{timeAgo(wd.date)}</td>
                    <td className="py-4 border-b border-theme-border text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest gap-1.5 ${
                        wd.status === 'Approved' || wd.status === 'Completed' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 
                        wd.status === 'Rejected' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {(wd.status === 'Approved' || wd.status === 'Completed') && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {wd.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        {wd.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {withdrawalHistory.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-theme-text-muted text-sm font-medium">
                      No withdrawal history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {selectedMethod && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-theme-surface rounded-3xl p-8 max-w-md w-full shadow-2xl border border-theme-border ${document.documentElement.getAttribute('data-theme') === 'liquid-glass' ? 'glass-effect bg-theme-surface/80' : document.documentElement.getAttribute('data-theme') === 'neon' ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : ''}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-theme-text">Withdraw via {selectedMethod}</h3>
                <button 
                  onClick={() => setSelectedMethod(null)}
                  className="p-2 text-theme-text-muted hover:text-theme-text hover:bg-theme-bg rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-widest mb-2">Amount to Withdraw ($)</label>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="5.00"
                    min="5"
                    step="0.01"
                    className="w-full px-4 py-3 bg-theme-bg border border-theme-border text-theme-text rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono text-lg"
                  />
                  <p className="text-xs text-theme-text-muted mt-2">Available balance: <span className="font-bold text-green-600">${balance.available.toFixed(2)}</span></p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-widest mb-2">Account Details</label>
                  <input 
                    type="text" 
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    placeholder="Email or Account ID"
                    className="w-full px-4 py-3 bg-theme-bg border border-theme-border text-theme-text rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <button 
                  onClick={submitWithdrawal}
                  disabled={isSubmitting}
                  className={`w-full mt-4 py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : 'Submit Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Withdrawal Success Modal */}
      <AnimatePresence>
        {showSuccess && lastWithdrawal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className={`bg-theme-surface rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden border border-theme-border ${document.documentElement.getAttribute('data-theme') === 'liquid-glass' ? 'glass-effect bg-theme-surface/80' : document.documentElement.getAttribute('data-theme') === 'neon' ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : ''}`}
            >
              {/* Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-primary" />
              
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 relative"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-5 h-5 text-orange-400" />
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-black text-theme-text mb-2 leading-tight">
                  🎉 Withdrawal Request Submitted
                </h3>
                <p className="text-theme-text-muted font-medium mb-8">
                  Your withdrawal request has been received successfully and is being processed.
                </p>

                <div className="w-full bg-theme-bg/50 rounded-3xl p-6 mb-8 text-left space-y-4 border border-theme-border">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Payment Method</span>
                    <span className="text-sm font-bold text-theme-text">{lastWithdrawal.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Amount</span>
                    <span className="text-sm font-black text-primary">${lastWithdrawal.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Status</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[10px] font-bold uppercase border border-amber-500/20">Pending Review</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-theme-border">
                    <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Est. Processing</span>
                    <span className="text-[11px] font-bold text-theme-text-muted italic">24–72 Hours</span>
                  </div>
                </div>

                <p className="text-xs text-theme-text-muted mb-8 font-medium">
                  A confirmation will be visible in your Withdrawal History under your profile.
                </p>

                <div className="flex flex-col w-full gap-3">
                  <button 
                    onClick={scrollToHistory}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                  >
                    View History <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 bg-theme-bg text-theme-text-muted rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-theme-border transition-all"
                  >
                    Earn More
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}
