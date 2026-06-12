import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, UserPlus, UserMinus, ShieldAlert, ShieldCheck, X, User, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, ShieldAlert as ShieldAlertIcon, MapPin, Globe, Monitor, Hash, Clock, Smartphone, AlertTriangle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { useTransactions } from '../context/TransactionContext';
import { supabase } from '../lib/supabase';
import UserAvatar from './UserAvatar';

export default function AdminUserDetailTab() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserById, updateUserStatus } = useUsers();
  const { transactions, addTransaction, refreshTransactions, getUserBalance } = useTransactions();
  
  const [loginHistoryRecords, setLoginHistoryRecords] = useState<any[]>([]);
  const [modalState, setModalState] = useState<'credit' | 'chargeback' | 'loginHistory' | null>(null);
  const [expandedLoginRow, setExpandedLoginRow] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [user, setUser] = useState<any>(null);
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const foundUser = await getUserById(id);
        setUser(foundUser);
        
        // Fetch referred users
        const { data: refs } = await supabase
          .from('users')
          .select('*')
          .eq('referred_by', id);
        
        // Fetch login history
        const { data: history } = await supabase
          .from('login_history')
          .select('*')
          .eq('user_id', id)
          .order('last_seen', { ascending: false });
        if (history) {
          setLoginHistoryRecords(history);
        }
        
        if (refs) {
          // For each referred user, we want their lifetime earnings and total commission generated
          const processedRefs = await Promise.all(refs.map(async (ru) => {
            const { data: txs } = await supabase
              .from('transactions')
              .select('amount, type, status')
              .eq('user_id', ru.id);
            
            let lifetime = 0;
            let commissionGenerated = 0;
            
            if (txs) {
              txs.forEach(t => {
                if ((t.status === 'Completed' || t.status === 'Approved') && t.amount > 0 && t.type !== 'Referral Commission') {
                  lifetime += parseFloat(t.amount);
                  commissionGenerated += parseFloat(t.amount) * 0.05;
                }
              });
            }
            
            return {
              ...ru,
              lifetime,
              commissionGenerated
            };
          }));
          setReferredUsers(processedRefs);
        }

        setLoading(false);
      }
    };
    fetchUser();
    refreshTransactions();
  }, [id]);

  const userTxs = useMemo(() => {
    return transactions.filter(t => t.userId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, id]);

  const stats = useMemo(() => {
    if (!id) return { available: 0, pending: 0, lifetime: 0, withdrawn: 0 };
    const balance = getUserBalance(id);
    
    // Calculate withdrawn manually here since getUserBalance doesn't track it
    let withdrawn = 0;
    userTxs.forEach(tx => {
      if (tx.type === 'Withdrawal Request' && tx.status === 'Approved') {
        withdrawn += Math.abs(tx.amount);
      } else if (tx.type === 'Withdrawal Approval') {
        withdrawn += Math.abs(tx.amount);
      }
    });

    return {
      available: balance.available,
      pending: balance.pending,
      lifetime: balance.lifetime,
      withdrawn: Math.max(0, withdrawn),
      referralEarnings: userTxs.reduce((acc, tx) => tx.type === 'Referral Commission' ? acc + tx.amount : acc, 0)
    };
  }, [id, transactions, userTxs]);

  const loginHistoryStats = useMemo(() => {
    if (!loginHistoryRecords.length) return { total: 0, uniqueIPs: 0, uniqueDevices: 0, lastLogin: 'N/A' };
    const uniqueIPs = new Set(loginHistoryRecords.map(r => r.ip_address)).size;
    const uniqueDevices = new Set(loginHistoryRecords.map(r => `${r.device_type}-${r.os}-${r.browser}`)).size;
    const lastLoginRecord = loginHistoryRecords[0];
    const lastLoginTime = new Date(lastLoginRecord.last_seen || lastLoginRecord.first_seen || new Date()).toLocaleString();
    return {
      total: loginHistoryRecords.length,
      uniqueIPs,
      uniqueDevices,
      lastLogin: lastLoginTime
    };
  }, [loginHistoryRecords]);

  const handleTransaction = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (modalState === 'credit') {
      await addTransaction({
        userId: id!,
        type: 'Manual Credit',
        amount: val,
        status: 'Completed',
        note: note || 'Manual Credit by Admin',
        providerName: 'System'
      });
    } else if (modalState === 'chargeback') {
      if (stats.available < val) {
        alert('Insufficient available balance to chargeback.');
        return;
      }
      await addTransaction({
        userId: id!,
        type: 'Chargeback',
        amount: -val,
        status: 'Completed',
        note: note || 'Manual Chargeback',
        providerName: 'System'
      });
    }
    setModalState(null);
    setAmount('');
    setNote('');
  };

  const toggleStatus = async () => {
    if (!user) return;
    const newStatus = user.status === 'Active' ? 'Banned' : 'Active';
    await updateUserStatus(user.id, newStatus);
    const updated = await getUserById(user.id);
    setUser(updated);
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading User Data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
        <button onClick={() => navigate('/admin/users')} className="text-blue-600 hover:underline">Return to User List</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/users')} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
            <UserAvatar 
              avatarId={user.avatarId} 
              size="lg" 
              fallbackName={user.fullName}
              className="mb-4 rounded-2xl shadow-sm"
            />
            <h3 className="text-lg font-bold text-gray-900">{user.fullName}</h3>
            <p className="text-sm text-gray-500 font-medium mb-1">{user.email}</p>
            <p className="text-[10px] text-gray-400 font-mono mb-4">{user.id}</p>
            
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-md mb-6 ${
              user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {user.status}
            </span>

            <button
              onClick={toggleStatus}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                user.status === 'Active' 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              {user.status === 'Active' ? (
                <><ShieldAlert className="w-4 h-4" /> Ban User</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> Activate User</>
              )}
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">Financial Actions</h4>
            
            <button 
              onClick={() => setModalState('credit')}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Add Balance (Credit)
            </button>
            <button 
              onClick={() => setModalState('chargeback')}
              className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
              <UserMinus className="w-4 h-4" /> Deduct Balance (Chargeback)
            </button>
          </div>

          {/* Referral Information */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 mb-6">Referral Information</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Referral Code</span>
                <span className="text-xs font-mono font-bold text-gray-900">{user.id.split('-')[0]}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Referrals</span>
                <span className="text-xs font-bold text-gray-900">{referredUsers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Commission Earned</span>
                <span className="text-xs font-bold text-green-600">${stats.referralEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Profile Survey Data */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
               <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Profile Survey</h4>
               {user.profileSurveyCompleted ? (
                 <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-black uppercase tracking-widest">Completed</span>
               ) : (
                 <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[9px] font-black uppercase tracking-widest">Pending</span>
               )}
            </div>
            
            {user.profileSurveyCompleted ? (
              user.profileSurveyData ? (
                <div className="space-y-4">
                  {[
                    { label: 'Gender', value: user.profileSurveyData.gender },
                    { label: 'Birthday', value: user.profileSurveyData.dob },
                    { label: 'Location', value: `${user.profileSurveyData.city}, ${user.profileSurveyData.state}, ${user.profileSurveyData.country}` },
                    { label: 'Education', value: user.profileSurveyData.education },
                    { label: 'Employment', value: `${user.profileSurveyData.employmentStatus} (${user.profileSurveyData.industry})` },
                    { label: 'Income', value: user.profileSurveyData.incomeRange },
                    { label: 'Household', value: `${user.profileSurveyData.maritalStatus}, ${user.profileSurveyData.childrenCount} children` },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pt-1 shrink-0">{item.label}</span>
                      <span className="text-xs font-bold text-gray-900 text-right">{item.value || 'N/A'}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interests & Devices</p>
                     <div className="flex flex-wrap gap-1.5">
                        {[...(user.profileSurveyData.devices || []), ...(user.profileSurveyData.interests || []), ...(user.profileSurveyData.shoppingHabits || [])].map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold">
                            {tag}
                          </span>
                        ))}
                     </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-green-600 font-medium italic">Survey completed (No profile details available).</p>
                </div>
              )
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-gray-400 font-medium italic">User has not completed the profile survey yet.</p>
              </div>
            )}
          </div>

          {/* Login History Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[280px]">
            <div className="flex items-center gap-3 mb-4 shrink-0">
               <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gray-900" />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Login History</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security & Sessions</p>
               </div>
            </div>
            
            <p className="text-xs text-gray-500 font-medium leading-relaxed flex-1">Monitor user login activity, device changes, location changes, and session behavior.</p>
            
            <button
               onClick={() => setModalState('loginHistory')}
               className="w-full py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              View Login History <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Stats & History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Available</span>
              <span className="text-xl font-black text-green-600">${stats.available.toFixed(2)}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pending</span>
              <span className="text-xl font-black text-amber-500">${stats.pending.toFixed(2)}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Lifetime Earned</span>
              <span className="text-xl font-black text-gray-900">${stats.lifetime.toFixed(2)}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Withdrawn</span>
              <span className="text-xl font-black text-gray-900">${stats.withdrawn.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {userTxs.map(tx => (
                    <tr key={tx.id}>
                      <td className="py-3 px-2 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <span className="font-medium text-gray-900 block">{tx.type}</span>
                        {tx.note && <span className="text-[10px] text-gray-400">{tx.note}</span>}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          tx.status === 'Completed' || tx.status === 'Approved' ? 'text-green-600' :
                          tx.status === 'Pending' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-3 px-2 text-right font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {userTxs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">No transactions recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Referred Users List */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Referred Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Join Date</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Lifetime Earned</th>
                    <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {referredUsers.map(ru => (
                    <tr key={ru.id}>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <UserAvatar avatarId={ru.avatar_id} size="sm" fallbackName={ru.first_name + ' ' + ru.last_name} />
                          <div>
                            <p className="font-bold text-gray-900">{ru.first_name} {ru.last_name}</p>
                            <p className="text-[10px] text-gray-500">{ru.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-500 font-medium">
                        {new Date(ru.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <p className="font-bold text-gray-900">${ru.lifetime.toFixed(2)}</p>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <p className="font-bold text-green-600">+${ru.commissionGenerated.toFixed(2)}</p>
                      </td>
                    </tr>
                  ))}
                  {referredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-20">
                          <User className="w-8 h-8" />
                          <p className="text-xs font-bold uppercase tracking-widest">No referred users found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {modalState && (
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
              className={`bg-white rounded-3xl p-8 ${modalState === 'loginHistory' ? 'max-w-4xl' : 'max-w-md'} w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {modalState === 'credit' ? 'Add Balance (Credit)' : 
                     modalState === 'chargeback' ? 'Deduct Balance (Chargeback)' : 
                     'Login History'}
                  </h3>
                  {modalState === 'loginHistory' && (
                    <p className="text-sm font-medium text-gray-500 mt-1">User login records and session activity.</p>
                  )}
                </div>
                <button onClick={() => setModalState(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalState === 'loginHistory' ? (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 shrink-0">
                     <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Records</span>
                        <span className="text-xl font-black text-gray-900">{loginHistoryStats.total}</span>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unique IPs</span>
                        <span className="text-xl font-black text-gray-900">{loginHistoryStats.uniqueIPs}</span>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unique Devices</span>
                        <span className="text-xl font-black text-gray-900">{loginHistoryStats.uniqueDevices}</span>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Login</span>
                        <span className="text-sm font-bold text-gray-900 pt-1">{loginHistoryStats.lastLogin}</span>
                     </div>
                  </div>

                  <div className="overflow-y-auto overflow-x-auto min-h-[300px] border border-gray-100 rounded-2xl">
                    <table className="w-full text-left min-w-[800px]">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">IP Address</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Device</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Browser / OS</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status / Risk</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {loginHistoryRecords.map((record) => (
                           <React.Fragment key={record.id}>
                              <tr className={`hover:bg-gray-50/50 transition-colors ${expandedLoginRow === record.id ? 'bg-gray-50/50' : ''}`}>
                                 <td className="py-4 px-4 text-gray-900 font-medium whitespace-nowrap">{new Date(record.created_at || record.first_seen).toLocaleString()}</td>
                                 <td className="py-4 px-4 text-gray-500 font-mono text-xs">{record.ip_address}</td>
                                 <td className="py-4 px-4 text-gray-900">{record.country}</td>
                                 <td className="py-4 px-4 text-gray-500">{record.device_type}</td>
                                 <td className="py-4 px-4">
                                   <div className="flex flex-col">
                                     <span className="text-gray-900">{record.browser}</span>
                                     <span className="text-[10px] text-gray-400 font-medium">{record.os}</span>
                                   </div>
                                 </td>
                                 <td className="py-4 px-4">
                                   <div className="flex flex-col gap-1.5 items-start">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                                       record.risk_status === 'SAFE' ? 'bg-green-50 text-green-600' :
                                       record.risk_status === 'HIGH_RISK' ? 'bg-red-50 text-red-600' :
                                       record.risk_status === 'NEW_DEVICE' || record.risk_status === 'NEW_IP' ? 'bg-amber-50 text-amber-600' :
                                       'bg-gray-50 text-gray-600'
                                     }`}>
                                       {record.risk_status === 'SAFE' && <ShieldCheck className="w-3 h-3" />}
                                       {record.risk_status === 'HIGH_RISK' && <AlertCircle className="w-3 h-3" />}
                                       {(record.risk_status === 'NEW_DEVICE' || record.risk_status === 'NEW_IP') && <AlertTriangle className="w-3 h-3" />}
                                       {record.risk_status.replace('_', ' ')}
                                     </span>
                                   </div>
                                 </td>
                                 <td className="py-4 px-4 text-right">
                                   <button onClick={() => setExpandedLoginRow(expandedLoginRow === record.id ? null : record.id)} className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                     {expandedLoginRow === record.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                   </button>
                                 </td>
                              </tr>
                              {expandedLoginRow === record.id && (
                                <tr className="bg-gray-50/50">
                                  <td colSpan={7} className="px-4 pb-6 pt-2">
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div>
                                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">City</span>
                                           <span className="text-sm font-medium text-gray-900">{record.city || 'Unknown'}</span>
                                        </div>
                                        <div>
                                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Login Count</span>
                                           <span className="text-sm font-medium text-gray-900">{record.login_count || 1}</span>
                                        </div>
                                        <div>
                                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">First Seen</span>
                                           <span className="text-sm font-medium text-gray-900">{new Date(record.first_seen || record.created_at).toLocaleString()}</span>
                                        </div>
                                        <div>
                                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Last Seen</span>
                                           <span className="text-sm font-medium text-gray-900">{record.last_seen ? new Date(record.last_seen).toLocaleString() : 'N/A'}</span>
                                        </div>
                                     </div>
                                  </td>
                                </tr>
                              )}
                           </React.Fragment>
                        ))}
                        
                        {loginHistoryRecords.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-16 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                                   <Clock className="w-5 h-5 text-gray-300" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">No login history found.</p>
                                  <p className="text-xs font-medium text-gray-500 mt-1">This user has not generated any login records yet.</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Amount ($)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none transition-colors font-mono"
                    />
                    {modalState === 'chargeback' && (
                      <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase">Max deduct: ${stats.available.toFixed(2)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Reason / Note</label>
                    <input 
                      type="text" 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Survey #123 Error"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-900 outline-none transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleTransaction}
                    className={`w-full mt-2 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-colors text-white ${
                      modalState === 'credit' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Confirm {modalState === 'credit' ? 'Credit' : 'Chargeback'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
