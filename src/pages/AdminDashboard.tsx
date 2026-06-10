// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  ChevronRight, 
  CreditCard, 
  Share2, 
  Globe, 
  Image, 
  Type, 
  Save, 
  RefreshCcw,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Settings,
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageSquare,
  Github,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  Layers,
  Brain,
  Target,
  ClipboardList
} from 'lucide-react';
import { useSettings, Provider } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import { useTransactions, TransactionStatus } from '../context/TransactionContext';
import { useUsers } from '../context/UserContext';
import UserAvatar from '../components/UserAvatar';
import RichTextEditor from '../components/RichTextEditor';
import AdminUsersTab from '../components/AdminUsersTab';
import AdminUserDetailTab from '../components/AdminUserDetailTab';
import { Users } from 'lucide-react';

export default function AdminDashboard() {
  const { settings, updateSettings, isLoading: settingsLoading, refreshSettings } = useSettings();
  const { transactions, updateTransactionStatus, refreshTransactions } = useTransactions();
  const { users, logout, refreshUsers } = useUsers();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');

  // Modal States
  const [socialModal, setSocialModal] = useState<{
    show: boolean;
    mode: 'add' | 'edit';
    data: any;
  }>({
    show: false,
    mode: 'add',
    data: { name: '', url: '', logoUrl: '' }
  });

  const [paymentModal, setPaymentModal] = useState<{
    show: boolean;
    mode: 'add' | 'edit';
    data: any;
  }>({
    show: false,
    mode: 'add',
    data: { name: '', logo: '', enabled: true, showOnLandingPage: true, url: '', order: 0 }
  });

  const [providerModal, setProviderModal] = useState<{
    show: boolean;
    mode: 'add' | 'edit';
    data: any;
  }>({
    show: false,
    mode: 'add',
    data: { name: '', slug: '', logoUrl: '', description: '', providerUrl: '', iframeUrl: '', apiKey: '', postbackUrl: '', type: 'survey', order: 0, active: true, featured: false }
  });

  useEffect(() => {
    refreshUsers();
    refreshTransactions();
  }, []);

  // Derive activeTab from URL
  const activeTab = useMemo(() => {
    // ... same code as before
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'overview';
    if (path === '/admin/settings') return 'settings';
    if (path === '/admin/security') return 'security';
    if (path === '/admin/social') return 'social';
    if (path === '/admin/payments') return 'payments';
    if (path === '/admin/legal') return 'legal';
    if (path === '/admin/providers') return 'providers';
    if (path === '/admin/surveys') return 'surveys';
    if (path === '/admin/offerwalls') return 'offerwalls';
    if (path === '/admin/transactions') return 'transactions';
    if (path === '/admin/users') return 'users';
    if (path.startsWith('/admin/users/')) return 'user_detail';
    return 'settings';
  }, [location.pathname]);

  // Form State for settings - initialized using effect when settings load
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const saved2FA = localStorage.getItem('admin_2fa_enabled') === 'true';
    setIs2FAEnabled(saved2FA);
  }, []);

  useEffect(() => {
    if (!settingsLoading && settings) {
      setFormData({
        name: settings.name,
        tagline: settings.tagline,
        logoText: settings.logoText,
        favicon: settings.favicon,
        copyright: settings.copyright,
        supportEmail: settings.supportEmail,
        businessEmail: settings.businessEmail,
        social: Array.isArray(settings.social) ? [...settings.social] : [],
        paymentMethods: Array.isArray(settings.paymentMethods) ? [...settings.paymentMethods] : [],
        providers: Array.isArray(settings.providers) ? [...settings.providers] : [],
        legalPages: settings.legalPages ? { ...settings.legalPages } : {
          privacy: { title: 'Privacy Policy', content: '' },
          terms: { title: 'Terms of Service', content: '' },
          cookies: { title: 'Cookie Policy', content: '' }
        }
      });
    }
  }, [settings, settingsLoading]);

  // ... (rest of the state and handlers)

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
      alert('Global configuration synchronized successfully.');
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (settingsLoading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Authenticating Admin Session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    // AdminGuard handles it
  };

  const toggle2FA = () => {
    if (is2FAEnabled) {
      if (confirm('Are you sure you want to disable Two-Factor Authentication? This will decrease account security.')) {
        setIs2FAEnabled(false);
        localStorage.setItem('admin_2fa_enabled', 'false');
      }
    } else {
      setShowSetup(true);
    }
  };

  const completeSetup = () => {
    setIs2FAEnabled(true);
    localStorage.setItem('admin_2fa_enabled', 'true');
    setShowSetup(false);
  };

  const navItems = [
    { id: 'settings', label: 'Website Settings', icon: Globe, path: '/admin/settings' },
    { id: 'users', label: 'Users Management', icon: Users, path: '/admin/users' },
    { id: 'transactions', label: 'Transactions', icon: ClipboardList, path: '/admin/transactions' },
    { id: 'surveys', label: 'Survey Providers', icon: Brain, path: '/admin/surveys' },
    { id: 'offerwalls', label: 'Offerwall Providers', icon: Target, path: '/admin/offerwalls' },
    { id: 'legal', label: 'Legal Pages', icon: BookOpen, path: '/admin/legal' },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard, path: '/admin/payments' },
    { id: 'social', label: 'Social Media', icon: Share2, path: '/admin/social' },
    { id: 'security', label: 'Security', icon: ShieldCheck, path: '/admin/security' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-gray-900">{settings.name}</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-10 shrink-0 bg-white shadow-sm z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              {navItems.find(item => item.id === activeTab)?.icon && (
                <span className="p-2 bg-gray-100 rounded-lg">
                  {React.createElement(navItems.find(item => item.id === activeTab)!.icon, { className: "w-5 h-5 text-gray-900" })}
                </span>
              )}
              {activeTab === 'user_detail' ? 'User Detailed View' : navItems.find(item => item.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">{settings.name} Admin</p>
                <p className="text-[10px] text-gray-500 font-medium">Administrator Access</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
                   <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Settings className="w-10 h-10 text-gray-900" />
                   </div>
                   <h2 className="text-3xl font-bold text-gray-900 mb-3">Admin Control Center</h2>
                   <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                      Manage your global platform settings, payout ecosystems, and external social connectivity from a single dashboard.
                   </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'legal' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm min-h-[800px]">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Legal Policies Page Builder</h2>
                      <p className="text-gray-500 text-sm font-medium">Enterprise-grade CMS for managing legal documentation and compliance.</p>
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg text-xs tracking-widest uppercase flex items-center gap-2"
                    >
                      {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Publish Changes
                    </button>
                  </div>

                  <div className="flex gap-4 p-1.5 bg-gray-100 rounded-2xl w-fit mb-10">
                    {(['privacy', 'terms', 'cookies'] as const).map((key) => (
                      <button
                        key={key}
                        onClick={() => setActiveLegalTab(key)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                          activeLegalTab === key 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {key === 'privacy' ? 'Privacy Policy' : key === 'terms' ? 'Terms of Service' : 'Cookie Policy'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                    {/* Editor Section */}
                    <div className="xl:col-span-2 space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-900 rounded-lg text-white">
                           <Edit2 className="w-4 h-4" />
                         </div>
                         <h3 className="font-bold text-gray-900">Content Editor</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Page Title</label>
                          <input 
                            type="text"
                            value={formData.legalPages[activeLegalTab].title}
                            onChange={(e) => setFormData({
                              ...formData,
                              legalPages: {
                                ...formData.legalPages,
                                [activeLegalTab]: { ...formData.legalPages[activeLegalTab], title: e.target.value }
                              }
                            })}
                            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 transition-all font-bold text-lg"
                            placeholder="Policy Title"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">HTML Content</label>
                          <RichTextEditor 
                            content={formData.legalPages[activeLegalTab].content}
                            onChange={(html) => setFormData({
                              ...formData,
                              legalPages: {
                                ...formData.legalPages,
                                [activeLegalTab]: { ...formData.legalPages[activeLegalTab], content: html }
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview Section */}
                    <div className="xl:col-span-3 space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-600 rounded-lg text-white">
                           <Eye className="w-4 h-4" />
                         </div>
                         <h3 className="font-bold text-gray-900">Desktop View Preview</h3>
                      </div>

                      <div className="rounded-3xl border border-gray-200 bg-gray-100 shadow-inner overflow-hidden flex flex-col h-[800px]">
                        {/* Browser Chrome */}
                        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
                           <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                           </div>
                           <div className="flex-1 bg-gray-100 rounded-lg py-1.5 px-4 text-[10px] text-gray-400 font-medium truncate">
                              https://{settings.name.toLowerCase().replace(/\s/g, '')}.com/legal/{activeLegalTab}-policy
                           </div>
                        </div>

                        {/* Simulated Web Page Content */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-12">
                          <div className="max-w-5xl mx-auto">
                            {/* Page Header */}
                            <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                  <span>Home</span>
                                  <ChevronRight className="w-3 h-3" />
                                  <span className="text-gray-900 font-black">Legal</span>
                               </div>

                               <div className="flex items-center gap-5 mb-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                                   <BookOpen className="w-6 h-6 text-gray-900" />
                                 </div>
                                 <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                   {formData.legalPages[activeLegalTab].title || 'Untitled Page'}
                                 </h1>
                               </div>
                               
                               <div className="flex items-center gap-2">
                                 <div className="h-0.5 w-12 bg-gray-900 rounded-full" />
                                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                   Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                 </p>
                               </div>
                            </div>
                            
                            {/* Policy Content Card */}
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 min-h-[400px]">
                              {formData.legalPages[activeLegalTab].content ? (
                                <div className="prose prose-gray prose-sm lg:prose-base max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-600">
                                  <div dangerouslySetInnerHTML={{ __html: formData.legalPages[activeLegalTab].content }} />
                                </div>
                              ) : (
                                <div className="py-20 text-center flex flex-col items-center gap-4 opacity-20">
                                  <RefreshCcw className="w-10 h-10 animate-spin-slow" />
                                  <p className="text-xs font-bold uppercase tracking-[0.3em]">System awaiting content...</p>
                                </div>
                              )}
                            </div>

                            {/* Footer Space Mock */}
                            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                 {settings.copyright}
                               </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-900 rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-400" />
                            <p className="text-xs text-white font-bold tracking-wide">
                              Live Adaptive Real-Time Preview
                            </p>
                         </div>
                         <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Sync Active</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Settings Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                      <h2 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Platform Branding
                      </h2>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Website Name</label>
                            <div className="relative">
                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Logo Shortcut</label>
                            <div className="relative">
                              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input 
                                type="text"
                                maxLength={2}
                                value={formData.logoText}
                                onChange={(e) => setFormData({...formData, logoText: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium uppercase"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Website Tagline</label>
                          <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="text"
                              value={formData.tagline}
                              onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Copyright Attribution</label>
                          <div className="relative">
                            <Save className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="text"
                              value={formData.copyright}
                              onChange={(e) => setFormData({...formData, copyright: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                            />
                          </div>
                        </div>

                        <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                          <h2 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                            Contact Settings
                          </h2>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Support Email</label>
                              <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                  type="email"
                                  value={formData.supportEmail}
                                  onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                                  placeholder="support@example.com"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Business Email</label>
                              <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                  type="email"
                                  value={formData.businessEmail}
                                  onChange={(e) => setFormData({...formData, businessEmail: e.target.value})}
                                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                                  placeholder="biz@example.com"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                          >
                            {isSaving ? (
                              <>
                                <RefreshCcw className="w-4 h-4 animate-spin" />
                                Synchronizing...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save Configuration
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm sticky top-30">
                      <h3 className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">Interface Preview</h3>
                      
                      {/* Navbar Preview */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 scale-95 origin-top">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase">{formData.logoText || 'S'}</div>
                            <span className="text-gray-900 font-bold text-xs">{formData.name || 'Website Name'}</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-4 h-1 bg-gray-100 rounded" />
                            <div className="w-4 h-1 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </div>

                      {/* Footer Preview */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 scale-95 origin-top">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase">{formData.logoText || 'S'}</div>
                           <span className="text-gray-900 font-bold text-xs">{formData.name || 'Website Name'}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{formData.tagline || 'Website Tagline'}</p>
                        <div className="pt-4 border-t border-gray-100">
                           <p className="text-[8px] text-gray-400 font-bold">{formData.copyright}</p>
                        </div>
                      </div>

                      <p className="mt-8 text-[10px] text-gray-400 font-bold text-center uppercase tracking-wider italic">
                        Real-time visualization of branding parameters.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                   <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                     <div>
                       <h2 className="text-xl font-bold text-gray-900 mb-1">Social Connectivity</h2>
                       <p className="text-gray-500 text-sm font-medium">Manage external platform integrations and public visibility.</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button
                          onClick={() => setSocialModal({ 
                            show: true, 
                            mode: 'add', 
                            data: { name: '', url: '', enabled: true } 
                          })}
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all border border-gray-200 text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           <Plus className="w-4 h-4" />
                           New Platform
                        </button>
                        <button
                          onClick={handleSaveSettings}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                           Sync Social
                        </button>
                     </div>
                   </div>

                   <div className="space-y-3">
                      {formData.social.map((platform, idx) => {
                        // Map name to icon
                        const getIcon = (name: string) => {
                          const n = name.toLowerCase();
                          if (n.includes('facebook')) return Facebook;
                          if (n.includes('twitter') || n.includes(' x')) return Twitter;
                          if (n.includes('instagram')) return Instagram;
                          if (n.includes('youtube')) return Youtube;
                          if (n.includes('discord')) return MessageSquare;
                          if (n.includes('github')) return Github;
                          return Share2;
                        };
                        const Icon = getIcon(platform.name);

                        return (
                          <div 
                            key={platform.id} 
                            className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-8 group hover:bg-white hover:border-gray-300 transition-all hover:shadow-sm"
                          >
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100 p-2 overflow-hidden">
                                {platform.logoUrl ? (
                                  <img src={platform.logoUrl} alt={platform.name} className="w-full h-full object-contain" />
                                ) : (
                                  <Icon className="w-6 h-6 text-gray-900" />
                                )}
                             </div>
                             
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                   <h3 className="font-bold text-gray-900 truncate">{platform.name}</h3>
                                   <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${platform.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                      {platform.enabled ? 'Live' : 'Hidden'}
                                   </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate max-w-sm">{platform.url || 'No redirect URL configured'}</p>
                             </div>

                             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    const newSocial = formData.social.map(s => 
                                      s.id === platform.id ? { ...s, enabled: !s.enabled } : s
                                    );
                                    setFormData({ ...formData, social: newSocial });
                                  }}
                                  className={`p-2 rounded-lg transition-colors ${platform.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                  {platform.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button 
                                  onClick={() => setSocialModal({ show: true, mode: 'edit', data: { ...platform } })}
                                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                     if (confirm('Delete this social platform permanently?')) {
                                        const newSocial = formData.social.filter(s => s.id !== platform.id);
                                        setFormData({ ...formData, social: newSocial });
                                     }
                                  }}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                        );
                      })}

                      {formData.social.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                           <Share2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Awaiting social link configuration</p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        Two-Factor Authentication
                        {is2FAEnabled && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </h2>
                      <p className="text-gray-500 font-medium max-w-xl text-sm">
                        Enhance account integrity by requiring a unique 6-digit synchronization code from a verified mobile device during the authentication phase.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={toggle2FA}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none ${
                          is2FAEnabled ? 'bg-gray-900' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 rounded-full transform bg-white transition-transform duration-300 shadow-sm ${
                            is2FAEnabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showSetup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-10 bg-gray-50/50"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                              <div>
                                <h4 className="text-gray-900 font-bold mb-1">Authenticator Link</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Initialize a secure hand-shake with your mobile authentication provider.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                              <div>
                                <h4 className="text-gray-900 font-bold mb-1">Secure Synchronization</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">Scan the encrypted matrix token below to link this administrator session.</p>
                              </div>
                            </div>

                            <div className="pt-4">
                              <button
                                onClick={completeSetup}
                                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 group text-xs uppercase tracking-widest"
                              >
                                Verify Synchronization
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-3xl shadow-sm relative">
                            <div className="w-40 h-40 bg-white rounded-2xl p-4 mb-6 border border-gray-100 flex items-center justify-center">
                                <QrCode className="w-full h-full text-gray-900" />
                            </div>
                            <code className="bg-gray-100 px-4 py-2 rounded-lg text-[10px] font-mono text-gray-900 border border-gray-200 uppercase font-bold">
                              SYNC_KEY: AIS-ADMIN-CTRL
                            </code>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                   <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                     <div>
                       <h2 className="text-xl font-bold text-gray-900 mb-1">Payout Ecosystem</h2>
                       <p className="text-gray-500 text-sm font-medium">Manage and prioritize reward distribution channels.</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button
                          onClick={() => setPaymentModal({ 
                            show: true, 
                            mode: 'add', 
                            data: { 
                              name: '', 
                              logo: '', 
                              url: '', 
                              order: formData.paymentMethods.length + 1, 
                              enabled: true,
                              showOnLandingPage: false 
                            } 
                          })}
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all border border-gray-200 text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           <Plus className="w-4 h-4" />
                           New Method
                        </button>
                        <button
                          onClick={handleSaveSettings}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                           Sync Status
                        </button>
                     </div>
                   </div>

                   <div className="space-y-3">
                      {[...formData.paymentMethods]
                        .sort((a, b) => a.order - b.order)
                        .map((method) => (
                        <div 
                          key={method.id} 
                          className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-8 group hover:bg-white hover:border-gray-300 transition-all hover:shadow-sm"
                        >
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100 p-2">
                              {method.logo ? (
                                <img src={method.logo} alt={method.name} className="w-full h-full object-contain" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-gray-300" />
                              )}
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-gray-900 truncate">{method.name}</h3>
                                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${method.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {method.enabled ? 'Active' : 'Private'}
                                 </span>
                                 {method.showOnLandingPage && (
                                   <span className="px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700">
                                      Landing Page
                                   </span>
                                 )}
                              </div>
                              <div className="flex items-center gap-4">
                                 <p className="text-xs text-gray-500 truncate max-w-sm">{method.url || 'No gateway URL configured'}</p>
                                 <div className="h-3 w-[1px] bg-gray-200" />
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Priority: {method.order}</p>
                              </div>
                           </div>

                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  const newMethods = formData.paymentMethods.map(m => 
                                    m.id === method.id ? { ...m, enabled: !m.enabled } : m
                                  );
                                  setFormData({ ...formData, paymentMethods: newMethods });
                                }}
                                className={`p-2 rounded-lg transition-colors ${method.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                              >
                                {method.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => setPaymentModal({ show: true, mode: 'edit', data: { ...method } })}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                   if (confirm('Delete this payout method permanently?')) {
                                      const newMethods = formData.paymentMethods.filter(m => m.id !== method.id);
                                      setFormData({ ...formData, paymentMethods: newMethods });
                                   }
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                      ))}

                      {formData.paymentMethods.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                           <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Awaiting payment method configuration</p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'surveys' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Provider Health Validation</h3>
                    <p className="text-sm text-gray-500">Checking global provider configuration status.</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900">{formData.providers.length}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Providers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-600">{formData.providers.filter(p => p.active).length}</p>
                      <p className="text-[10px] font-bold text-green-600/70 uppercase tracking-widest">Active Provider{formData.providers.filter(p => p.active).length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-400">{formData.providers.filter(p => !p.active).length}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inactive</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-amber-500">{formData.providers.filter(p => !p.logoUrl).length}</p>
                      <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest">Missing Logos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-red-500">{formData.providers.filter(p => !p.providerUrl && !p.iframeUrl).length}</p>
                      <p className="text-[10px] font-bold text-red-600/70 uppercase tracking-widest">Missing URLs</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                   <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                     <div>
                       <h2 className="text-xl font-bold text-gray-900 mb-1">Survey Providers Configuration</h2>
                       <p className="text-gray-500 text-sm font-medium">Manage survey platforms.</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button
                          onClick={() => setProviderModal({ 
                            show: true, 
                            mode: 'add', 
                            data: { name: '', slug: '', logoUrl: '', description: '', type: 'survey', active: true, order: formData.providers.length + 1, statusText: 'Active', themeColor: 'bg-blue-50 text-blue-600 border-blue-100' } 
                          })}
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all border border-gray-200 text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           <Plus className="w-4 h-4" />
                           New Provider
                        </button>
                        <button
                          onClick={handleSaveSettings}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                           Sync Status
                        </button>
                     </div>
                   </div>

                   <div className="space-y-3">
                      {[...formData.providers]
                        .filter(p => p.type === 'survey')
                        .sort((a, b) => a.order - b.order)
                        .map((provider) => (
                        <div 
                          key={provider.id} 
                          className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-8 group hover:bg-white hover:border-gray-300 transition-all hover:shadow-sm"
                        >
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100 p-2">
                              {provider.logoUrl ? (
                                <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                              ) : (
                                <Layers className="w-5 h-5 text-gray-300" />
                              )}
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-gray-900 truncate">{provider.name}</h3>
                                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${provider.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {provider.active ? 'Active' : 'Inactive'}
                                 </span>
                                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700`}>
                                    {provider.type === 'survey' ? 'Survey' : 'Offerwall'}
                                 </span>
                              </div>
                              <div className="flex items-center gap-4">
                                 <p className="text-xs text-gray-500 truncate max-w-sm">{provider.description}</p>
                                 <div className="h-3 w-[1px] bg-gray-200" />
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Priority: {provider.order}</p>
                              </div>
                           </div>

                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={async () => {
                                  const table = provider.type === 'survey' ? 'survey_providers' : 'offerwall_providers';
                                  const { error } = await supabase.from(table).update({ active: !provider.active }).eq('id', provider.id);
                                  if (error) {
                                      console.error('PROVIDER UPDATE ERROR', error);
                                      alert(`Error updating provider: ${error.message}`);
                                  } else {
                                      await refreshSettings();
                                  }
                                }}
                                className={`p-2 rounded-lg transition-colors ${provider.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                              >
                                {provider.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => setProviderModal({ show: true, mode: 'edit', data: { ...provider } })}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={async () => {
                                   if (confirm('Delete this provider permanently?')) {
                                      const table = provider.type === 'survey' ? 'survey_providers' : 'offerwall_providers';
                                      const { error } = await supabase.from(table).delete().eq('id', provider.id);
                                      if (error) {
                                          console.error('PROVIDER DELETE ERROR', error);
                                          alert(`Error deleting provider: ${error.message}`);
                                      } else {
                                          await refreshSettings();
                                      }
                                   }
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                      ))}

                      {formData.providers.filter(p => p.type === 'survey').length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                           <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No providers configured</p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'offerwalls' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Provider Health Validation</h3>
                    <p className="text-sm text-gray-500">Checking global provider configuration status.</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900">{formData.providers.length}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-600">{formData.providers.filter(p => p.active).length}</p>
                      <p className="text-[10px] font-bold text-green-600/70 uppercase tracking-widest">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-400">{formData.providers.filter(p => !p.active).length}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inactive</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-amber-500">{formData.providers.filter(p => !p.logoUrl).length}</p>
                      <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest">Missing Logos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-red-500">{formData.providers.filter(p => !p.providerUrl && !p.iframeUrl).length}</p>
                      <p className="text-[10px] font-bold text-red-600/70 uppercase tracking-widest">Missing URLs</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                   <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                     <div>
                       <h2 className="text-xl font-bold text-gray-900 mb-1">Offerwall Providers Configuration</h2>
                       <p className="text-gray-500 text-sm font-medium">Manage offerwall platforms.</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button
                          onClick={() => setProviderModal({ 
                            show: true, 
                            mode: 'add', 
                            data: { name: '', slug: '', logoUrl: '', description: '', type: 'offerwall', active: true, order: formData.providers.length + 1, statusText: 'Active', themeColor: 'bg-blue-50 text-blue-600 border-blue-100' } 
                          })}
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all border border-gray-200 text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           <Plus className="w-4 h-4" />
                           New Provider
                        </button>
                        <button
                          onClick={handleSaveSettings}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg text-xs tracking-widest uppercase flex items-center gap-2"
                        >
                           {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                           Sync Status
                        </button>
                     </div>
                   </div>

                   <div className="space-y-3">
                      {[...formData.providers]
                        .filter(p => p.type === 'offerwall')
                        .sort((a, b) => a.order - b.order)
                        .map((provider) => (
                        <div 
                          key={provider.id} 
                          className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-8 group hover:bg-white hover:border-gray-300 transition-all hover:shadow-sm"
                        >
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100 p-2">
                              {provider.logoUrl ? (
                                <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
                              ) : (
                                <Layers className="w-5 h-5 text-gray-300" />
                              )}
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-gray-900 truncate">{provider.name}</h3>
                                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${provider.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {provider.active ? 'Active' : 'Inactive'}
                                 </span>
                                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700`}>
                                    {provider.type === 'survey' ? 'Survey' : 'Offerwall'}
                                 </span>
                              </div>
                              <div className="flex items-center gap-4">
                                 <p className="text-xs text-gray-500 truncate max-w-sm">{provider.description}</p>
                                 <div className="h-3 w-[1px] bg-gray-200" />
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Priority: {provider.order}</p>
                              </div>
                           </div>

                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={async () => {
                                  const table = provider.type === 'survey' ? 'survey_providers' : 'offerwall_providers';
                                  const { error } = await supabase.from(table).update({ active: !provider.active }).eq('id', provider.id);
                                  if (error) {
                                      console.error('PROVIDER UPDATE ERROR', error);
                                      alert(`Error updating provider: ${error.message}`);
                                  } else {
                                      await refreshSettings();
                                  }
                                }}
                                className={`p-2 rounded-lg transition-colors ${provider.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                              >
                                {provider.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => setProviderModal({ show: true, mode: 'edit', data: { ...provider } })}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={async () => {
                                   if (confirm('Delete this provider permanently?')) {
                                      const table = provider.type === 'survey' ? 'survey_providers' : 'offerwall_providers';
                                      const { error } = await supabase.from(table).delete().eq('id', provider.id);
                                      if (error) {
                                          console.error('PROVIDER DELETE ERROR', error);
                                          alert(`Error deleting provider: ${error.message}`);
                                      } else {
                                          await refreshSettings();
                                      }
                                   }
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                      ))}

                      {formData.providers.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                           <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No providers configured</p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && <AdminUsersTab />}
            {activeTab === 'user_detail' && <AdminUserDetailTab />}

            {activeTab === 'transactions' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
                   <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                     <div>
                       <h2 className="text-xl font-bold text-gray-900 mb-1">Transaction Ledger</h2>
                       <p className="text-gray-500 text-sm font-medium">Manage user credits, debits, and withdrawals.</p>
                     </div>
                   </div>

                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="border-b border-gray-200">
                           <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 rounded-tl-xl border-r border-gray-200">ID</th>
                           <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">User</th>
                           <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Type</th>
                           <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Details</th>
                           <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Amount</th>
                           <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-r border-gray-200">Status</th>
                           <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 rounded-tr-xl">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-sm">
                         {transactions.map(tx => (
                           <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                             <td className="py-3 px-4 font-mono text-xs text-gray-500">{tx.id}</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-3">
                                 <UserAvatar 
                                   avatarId={users.find(u => u.id === tx.userId)?.avatarId || null} 
                                   size="sm" 
                                   fallbackName={users.find(u => u.id === tx.userId)?.fullName} 
                                   className="rounded-full shadow-sm"
                                 />
                                 <div className="flex flex-col">
                                   <span className="text-gray-900 font-bold">
                                     {users.find(u => u.id === tx.userId)?.fullName || 'Unknown User'}
                                   </span>
                                   <span className="text-[10px] text-gray-400 font-mono">{tx.userId}</span>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-gray-900 font-medium">{tx.type}</td>
                             <td className="py-3 px-4 text-gray-600 font-medium">
                               {tx.providerName && <span className="font-bold text-gray-900 block">{tx.providerName}</span>}
                               {tx.note && <span className="text-xs">{tx.note}</span>}
                             </td>
                             <td className="py-3 px-4">
                               <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                 {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                               </span>
                             </td>
                             <td className="py-3 px-4">
                               <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${
                                 tx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                 tx.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                 tx.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                 'bg-amber-100 text-amber-700'
                               }`}>
                                 {tx.status}
                               </span>
                             </td>
                             <td className="py-3 px-4">
                               {tx.status === 'Pending' && tx.type === 'Withdrawal Request' ? (
                                 <div className="flex items-center gap-2">
                                   <button 
                                     onClick={() => updateTransactionStatus(tx.id, 'Approved')}
                                     className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-bold uppercase hover:bg-green-100 transition-colors"
                                   >
                                     Approve
                                   </button>
                                   <button 
                                     onClick={() => updateTransactionStatus(tx.id, 'Rejected')}
                                     className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold uppercase hover:bg-red-100 transition-colors"
                                   >
                                     Reject
                                   </button>
                                 </div>
                               ) : (
                                 <span className="text-gray-300 text-xs">-</span>
                               )}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              </motion.div>
            )}

       {/* Modals moved outside of tab-specific blocks */}
       <AnimatePresence>
         {socialModal.show && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSocialModal({ ...socialModal, show: false })}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-10 overflow-hidden"
              >
                 <h3 className="text-2xl font-bold text-gray-900 mb-8">{socialModal.mode === 'add' ? 'Add Social Link' : 'Edit Social Link'}</h3>
                 
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Platform Name</label>
                       <input 
                         value={socialModal.data.name}
                         onChange={(e) => setSocialModal({ ...socialModal, data: { ...socialModal.data, name: e.target.value } })}
                         className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                         placeholder="e.g. Facebook"
                       />
                       <p className="text-[10px] text-gray-400 font-medium ml-1">Icon will auto-map based on the name (Facebook, Twitter, etc.) if Logo URL is empty.</p>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Platform Logo URL</label>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-300 overflow-hidden shrink-0">
                             {socialModal.data.logoUrl ? (
                               <img src={socialModal.data.logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                             ) : (
                               <Share2 className="w-6 h-6" />
                             )}
                          </div>
                          <div className="flex-1 space-y-2">
                             <input 
                               type="text"
                               placeholder="Paste custom logo image URL..."
                               value={socialModal.data.logoUrl}
                               onChange={(e) => setSocialModal({ ...socialModal, data: { ...socialModal.data, logoUrl: e.target.value } })}
                               className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all"
                             />
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Profile/Redirect URL</label>
                       <input 
                         value={socialModal.data.url}
                         onChange={(e) => setSocialModal({ ...socialModal, data: { ...socialModal.data, url: e.target.value } })}
                         className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-mono text-xs"
                         placeholder="https://facebook.com/yourprofile"
                       />
                    </div>

                    <div className="pt-6 flex gap-4">
                       <button 
                         onClick={() => setSocialModal({ ...socialModal, show: false })}
                         className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                         onClick={() => {
                            let newSocial = [...formData.social];
                            if (socialModal.mode === 'add') {
                               newSocial.push({ 
                                 ...socialModal.data, 
                                 id: Math.random().toString(36).substr(2, 9) 
                               });
                            } else {
                               newSocial = newSocial.map(s => s.id === socialModal.data.id ? { ...socialModal.data } : s);
                            }
                            setFormData({ ...formData, social: newSocial });
                            setSocialModal({ ...socialModal, show: false });
                         }}
                         className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
                       >
                          {socialModal.mode === 'add' ? 'Add Platform' : 'Update Record'}
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>

       <AnimatePresence>
         {paymentModal.show && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPaymentModal({ ...paymentModal, show: false })}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-10 overflow-hidden"
              >
                 <h3 className="text-2xl font-bold text-gray-900 mb-8">{paymentModal.mode === 'add' ? 'Add Payout Method' : 'Edit Payout Method'}</h3>
                 
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Method Name</label>
                       <input 
                         value={paymentModal.data.name}
                         onChange={(e) => setPaymentModal({ ...paymentModal, data: { ...paymentModal.data, name: e.target.value } })}
                         className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                         placeholder="e.g. PayPal"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Method Logo</label>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-300 overflow-hidden shrink-0">
                             {paymentModal.data.logo ? (
                               <img src={paymentModal.data.logo} alt="Preview" className="w-full h-full object-contain p-2" />
                             ) : (
                               <Image className="w-6 h-6" />
                             )}
                          </div>
                          <div className="flex-1 space-y-2">
                             <input 
                               type="text"
                               placeholder="Paste image URL..."
                               value={paymentModal.data.logo}
                               onChange={(e) => setPaymentModal({ ...paymentModal, data: { ...paymentModal.data, logo: e.target.value } })}
                               className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all"
                             />
                             <div className="flex items-center justify-between">
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Direct Image Upload Selection</p>
                               <button className="text-[10px] text-gray-900 font-bold uppercase underline">Browse Files</button>
                             </div>
                          </div>
                       </div>
                    </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Visibility Settings</label>
                           <div className="space-y-3">
                              <button 
                                onClick={() => setPaymentModal({ ...paymentModal, data: { ...paymentModal.data, enabled: !paymentModal.data.enabled } })}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${paymentModal.data.enabled ? 'bg-green-50 border-green-200 text-green-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    {paymentModal.data.enabled ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5" />}
                                    <span className="text-sm font-bold">Active Status</span>
                                 </div>
                                 <div className={`w-10 h-5 rounded-full relative transition-colors ${paymentModal.data.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${paymentModal.data.enabled ? 'left-6' : 'left-1'}`} />
                                 </div>
                              </button>

                              <button 
                                onClick={() => setPaymentModal({ ...paymentModal, data: { ...paymentModal.data, showOnLandingPage: !paymentModal.data.showOnLandingPage } })}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${paymentModal.data.showOnLandingPage ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <Globe className={`w-5 h-5 ${paymentModal.data.showOnLandingPage ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="text-sm font-bold">Show On Landing Page</span>
                                 </div>
                                 <div className={`w-10 h-5 rounded-full relative transition-colors ${paymentModal.data.showOnLandingPage ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${paymentModal.data.showOnLandingPage ? 'left-6' : 'left-1'}`} />
                                 </div>
                              </button>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Gateway URL</label>
                           <input 
                             value={paymentModal.data.url}
                             onChange={(e) => setPaymentModal({ ...paymentModal, data: { ...paymentModal.data, url: e.target.value } })}
                             className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-mono text-xs"
                             placeholder="https://..."
                           />
                           <div className="pt-2 space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Priority Order</label>
                             <input 
                               type="number"
                               value={paymentModal.data.order}
                               onChange={(e) => setPaymentModal({ ...paymentModal, data: { ...paymentModal.data, order: parseInt(e.target.value) || 0 } })}
                               className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                             />
                           </div>
                        </div>
                     </div>

                    <div className="pt-6 flex gap-4">
                       <button 
                         onClick={() => setPaymentModal({ ...paymentModal, show: false })}
                         className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                         onClick={() => {
                            let newMethods = [...formData.paymentMethods];
                            if (paymentModal.mode === 'add') {
                               newMethods.push({ 
                                 ...paymentModal.data, 
                                 id: Math.random().toString(36).substr(2, 9) 
                               });
                            } else {
                               newMethods = newMethods.map(m => m.id === paymentModal.data.id ? { ...paymentModal.data } : m);
                            }
                            setFormData({ ...formData, paymentMethods: newMethods });
                            setPaymentModal({ ...paymentModal, show: false });
                         }}
                         className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
                       >
                          {paymentModal.mode === 'add' ? 'Confirm Addition' : 'Update Record'}
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>

       <AnimatePresence>
         {providerModal.show && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setProviderModal({ ...providerModal, show: false })}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-2xl p-10 overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                 <h3 className="text-2xl font-bold text-gray-900 mb-8">{providerModal.mode === 'add' ? 'Add Provider' : 'Edit Provider'}</h3>
                 
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Provider Name</label>
                          <input 
                            value={providerModal.data.name}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, name: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                            placeholder="e.g. CPX Research"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Slug</label>
                          <input 
                            value={providerModal.data.slug}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, slug: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                            placeholder="e.g. cpx"
                          />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Provider Logo</label>
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-300 overflow-hidden shrink-0">
                             {providerModal.data.logoUrl ? (
                               <img src={providerModal.data.logoUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                             ) : (
                               <Layers className="w-6 h-6" />
                             )}
                          </div>
                          <div className="flex-1 space-y-2">
                             <input 
                               type="text"
                               placeholder="Paste image URL..."
                               value={providerModal.data.logoUrl}
                               onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, logoUrl: e.target.value } })}
                               className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                       <input 
                         value={providerModal.data.description}
                         onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, description: e.target.value } })}
                         className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium text-sm"
                         placeholder="e.g. Best matching surveys daily"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Provider URL</label>
                          <input 
                            value={providerModal.data.providerUrl || ''}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, providerUrl: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium text-sm"
                            placeholder="https://..."
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Iframe URL</label>
                          <input 
                            value={providerModal.data.iframeUrl || ''}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, iframeUrl: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium text-sm"
                            placeholder="https://..."
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">API Key</label>
                          <input 
                            value={providerModal.data.apiKey || ''}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, apiKey: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium text-sm"
                            placeholder="API Key"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Postback URL</label>
                          <input 
                            value={providerModal.data.postbackUrl || ''}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, postbackUrl: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium text-sm"
                            placeholder="/api/postback/..."
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Type</label>
                          <select 
                            value={providerModal.data.type}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, type: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium text-sm"
                          >
                             <option value="survey">Survey</option>
                             <option value="offerwall">Offerwall</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Priority Order</label>
                          <input 
                            type="number"
                            value={providerModal.data.order}
                            onChange={(e) => setProviderModal({ ...providerModal, data: { ...providerModal.data, order: parseInt(e.target.value) || 0 } })}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition-all font-medium"
                          />
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                       <div>
                          <p className="font-bold text-gray-900">Featured Provider</p>
                          <p className="text-xs text-gray-500">Highlight this provider at the top</p>
                       </div>
                       <button 
                         onClick={() => setProviderModal({ ...providerModal, data: { ...providerModal.data, featured: !providerModal.data.featured } })}
                         className={`w-12 h-6 rounded-full transition-colors relative ${providerModal.data.featured ? 'bg-green-500' : 'bg-gray-300'}`}
                       >
                         <span className={`absolute top-1 max-h-4 shadow-sm w-4 h-4 bg-white rounded-full transition-all ${providerModal.data.featured ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                       <div>
                          <p className="font-bold text-gray-900">Active Status</p>
                          <p className="text-xs text-gray-500">Enable or disable this provider</p>
                       </div>
                       <button 
                         onClick={() => setProviderModal({ ...providerModal, data: { ...providerModal.data, active: !providerModal.data.active } })}
                         className={`w-12 h-6 rounded-full transition-colors relative ${providerModal.data.active ? 'bg-green-500' : 'bg-gray-300'}`}
                       >
                         <span className={`absolute top-1 max-h-4 shadow-sm w-4 h-4 bg-white rounded-full transition-all ${providerModal.data.active ? 'left-7' : 'left-1'}`} />
                       </button>
                    </div>

                    <div className="pt-6 flex gap-4">
                       <button 
                         onClick={() => setProviderModal({ ...providerModal, show: false })}
                         className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                         onClick={async () => {
                            const pId = providerModal.data.id;
                            const table = providerModal.data.type === 'survey' ? 'survey_providers' : 'offerwall_providers';
                            const payload = {
                               name: providerModal.data.name,
                               slug: providerModal.data.slug,
                               logo_url: providerModal.data.logoUrl || '',
                               description: providerModal.data.description || '',
                               active: providerModal.data.active,
                               priority: providerModal.data.order,
                               featured: providerModal.data.featured || false,
                               provider_url: providerModal.data.providerUrl || null,
                               iframe_url: providerModal.data.iframeUrl || null,
                               api_key: providerModal.data.apiKey || null,
                               postback_url: providerModal.data.postbackUrl || null
                            };
                            
                            console.log('PROVIDER INSERT PAYLOAD', payload);
                            let errorMsg = null;
                            if (providerModal.mode === 'add') {
                               const { data, error } = await supabase.from(table).insert([payload]).select();
                               if (error) {
                                  errorMsg = error.message;
                                  console.error('PROVIDER INSERT ERROR', error);
                               } else {
                                  console.log('PROVIDER INSERT RESULT', data);
                               }
                            } else {
                               const { data, error } = await supabase.from(table).update(payload).eq('id', pId).select();
                               if (error) {
                                  errorMsg = error.message;
                                  console.error('PROVIDER UPDATE ERROR', error);
                               } else {
                                  console.log('PROVIDER UPDATE RESULT', data);
                               }
                            }
                            
                            if (errorMsg) {
                               alert(`Supabase Error: ${errorMsg}`);
                               return;
                            }
                            
                            await refreshSettings();
                            setProviderModal({ ...providerModal, show: false });
                         }}
                         className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
                       >
                          {providerModal.mode === 'add' ? 'Confirm Addition' : 'Update Record'}
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>

          </div>
        </div>
      </main>
    </div>
  );
}