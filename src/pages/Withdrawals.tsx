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
        providerName: method,
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
            <h2 className="text-3xl font-black text-gray-900 tracking-tight font-display mb-2">Withdraw Rewards</h2>
            <p className="text-gray-500 font-medium">Select a payment method to cash out your available balance.</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Available to Withdraw</p>
              <p className="text-2xl font-black text-gray-900 leading-none">${balance.available.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(settings.paymentMethods || []).filter(pm => pm.enabled).map((method) => (
            <div key={method.id} onClick={() => handleWithdrawStart(method.name)} className="bg-white border border-gray-100 rounded-[1.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden p-4 shadow-inner relative z-10">
                {method.logo ? (
                  <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                ) : (
                  <Wallet className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors relative z-10">{method.name}</h3>
              <p className="text-xs text-gray-500 font-medium relative z-10 mb-6">Min. $5.00</p>
              
              <button className="w-full py-3.5 bg-gray-50 group-hover:bg-primary text-gray-600 group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-gray-100 group-hover:border-primary shadow-sm relative z-10">
                Select <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
              
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
          
          {(!settings.paymentMethods || settings.paymentMethods.length === 0) && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center">
              <Wallet className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No payment methods available</p>
            </div>
          )}
        </div>

        {/* Withdrawal History */}
        <div ref={historyRef} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Withdrawal History</h3>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">ID</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Method</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Amount</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">Date</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {withdrawalHistory.map((wd, i) => (
                  <tr key={wd.id} className="group hover:bg-gray-50">
                    <td className="py-4 border-b border-gray-50 text-gray-500 font-mono text-xs hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {wd.id} <Copy className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="py-4 border-b border-gray-50 font-bold text-gray-900">{wd.providerName}</td>
                    <td className="py-4 border-b border-gray-50 font-bold text-gray-900">${Math.abs(wd.amount).toFixed(2)}</td>
                    <td className="py-4 border-b border-gray-50 text-gray-500">{timeAgo(wd.date)}</td>
                    <td className="py-4 border-b border-gray-50 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest gap-1.5 ${
                        wd.status === 'Approved' || wd.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-200' : 
                        wd.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-200' :
                        'bg-[#FFF9F2] text-[#FF9500] border border-[#FFE7CC]'
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
                    <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
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
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Withdraw via {selectedMethod}</h3>
                <button 
                  onClick={() => setSelectedMethod(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Amount to Withdraw ($)</label>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="5.00"
                    min="5"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">Available balance: <span className="font-bold text-green-600">${balance.available.toFixed(2)}</span></p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Account Details</label>
                  <input 
                    type="text" 
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    placeholder="Email or Account ID"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-primary" />
              
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative"
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

                <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                  🎉 Withdrawal Request Submitted
                </h3>
                <p className="text-gray-500 font-medium mb-8">
                  Your withdrawal request has been received successfully and is being processed.
                </p>

                <div className="w-full bg-gray-50 rounded-3xl p-6 mb-8 text-left space-y-4 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</span>
                    <span className="text-sm font-bold text-gray-900">{lastWithdrawal.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</span>
                    <span className="text-sm font-black text-primary">${lastWithdrawal.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold uppercase">Pending Review</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Processing</span>
                    <span className="text-[11px] font-bold text-gray-600 italic">24–72 Hours</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-8 font-medium">
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
                    className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
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
