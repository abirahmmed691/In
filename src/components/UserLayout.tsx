import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Wallet, 
  User, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Gift,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTransactions } from '../context/TransactionContext';
import { useUsers } from '../context/UserContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'offers', label: 'Offers', icon: Gift },
  { id: 'surveys', label: 'Surveys', icon: ClipboardList },
  { id: 'withdrawals', label: 'Withdrawals', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

import UserAvatar from './UserAvatar';

export default function UserLayout({ children, title = 'Overview' }: { children: React.ReactNode, title?: string }) {
  const { settings } = useSettings();
  const { balance, transactions } = useTransactions();
  const { currentUser, logout } = useUsers();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [lastReadTxId, setLastReadTxId] = useState<string | null>(() => localStorage.getItem('last_read_tx_id'));
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[1] && pathParts[1] !== '' ? pathParts[1] : 'dashboard';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentTransactions = useMemo(() => {
    if (!currentUser) return [];
    return transactions
      .filter(t => t.userId === currentUser.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions, currentUser]);

  const hasUnread = useMemo(() => {
    if (recentTransactions.length === 0) return false;
    if (!lastReadTxId) return true;
    return recentTransactions[0].id !== lastReadTxId;
  }, [recentTransactions, lastReadTxId]);

  const handleMarkAsRead = () => {
    if (recentTransactions.length > 0) {
      setLastReadTxId(recentTransactions[0].id);
      localStorage.setItem('last_read_tx_id', recentTransactions[0].id);
    }
  };

  const handleSignOut = async () => {
    await logout();
    // No navigate here - UserGuard handles redirection, preventing flash
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex font-sans selection:bg-primary/20 selection:text-primary">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center px-8 border-b border-gray-100 shrink-0">
          <Link to="/" className="text-xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-[14px] flex items-center justify-center relative shadow-sm hover:scale-105 transition-transform">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
              </svg>
            </div>
            {settings.name}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id === 'dashboard' ? '/dashboard' : `/${item.id}`);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-orange-50 text-primary shadow-sm ring-1 ring-orange-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0 space-y-4">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors group font-semibold text-sm tracking-wide"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 hidden md:block tracking-wide">{title}</h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-6 mr-2">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Available balance</span>
                <span className="text-base font-black text-gray-900 leading-none">${balance.available.toFixed(2)}</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Pending rewards</span>
                <span className="text-base font-black text-[#5856D6] leading-none">${balance.pending.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-primary transition-colors focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {hasUnread && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,138,31,0.5)]"></span>}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <h3 className="font-bold text-gray-900 text-sm">Recent Activity</h3>
                      {hasUnread && (
                        <button 
                          onClick={handleMarkAsRead}
                          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-orange-600 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {recentTransactions.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                          {recentTransactions.map((tx) => (
                            <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="relative shrink-0 mt-0.5">
                                  <UserAvatar 
                                    avatarId={currentUser?.avatarId || null} 
                                    size="sm" 
                                    fallbackName={currentUser?.fullName}
                                    className="border border-gray-100 shadow-sm"
                                  />
                                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white ${
                                    tx.amount > 0 ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                  }`}>
                                    {tx.amount > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">
                                    {tx.type}
                                  </p>
                                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                    {tx.providerName && <span>{tx.providerName} • </span>}
                                    {tx.note && <span>{tx.note}</span>}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className={`text-xs font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                      {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                      {new Date(tx.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                          No recent activity to show.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/profile" className="flex items-center gap-3 focus:outline-none group">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900 leading-none group-hover:text-primary transition-colors">{currentUser?.fullName}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Active Member</span>
              </div>
              <UserAvatar 
                avatarId={currentUser?.avatarId || null} 
                size="sm" 
                fallbackName={currentUser?.fullName}
                className="group-hover:ring-2 ring-primary/20 transition-all"
              />
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
