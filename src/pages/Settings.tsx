import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Shield, Eye, EyeOff, Save, ShieldAlert, User, Trash2, X, CheckCircle2, Palette, Sun, Moon, Sparkles, Zap } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useUsers } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { AVATARS } from '../constants/avatars';
import UserAvatar from '../components/UserAvatar';

export default function Settings() {
  const { currentUser, updateProfile, updatePassword } = useUsers();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(currentUser?.avatarId || null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleUpdateName = async () => {
    if (!firstName || !lastName) {
      setMessage({ type: 'error', text: 'First and last name are required.' });
      return;
    }
    
    setIsSaving(true);
    const result = await updateProfile({ firstName, lastName });
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Display name updated successfully.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update name.' });
    }
    setIsSaving(false);
  };

  const handleSelectAvatar = (avatarId: string) => {
    if (currentUser?.hasSelectedAvatar) return;
    setSelectedAvatarId(avatarId);
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatarId) {
      setMessage({ type: 'error', text: 'Please select an avatar first.' });
      return;
    }
    
    setIsSaving(true);
    const result = await updateProfile({ avatarId: selectedAvatarId });
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Avatar selected successfully.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to select avatar.' });
    }
    setIsSaving(false);
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setMessage({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    
    if (passwords.new.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }

    setIsSaving(true);
    const result = await updatePassword(passwords.current, passwords.new);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update password.' });
    }
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    alert("Account deletion requested.");
    setIsDeleteModalOpen(false);
  };

  if (!currentUser) return null;

  return (
    <UserLayout title="Settings">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 max-w-4xl"
      >
        <div>
          <h2 className="text-3xl font-black text-theme-text tracking-tight font-display mb-2">Account Settings</h2>
          <p className="text-theme-text-muted font-medium">Manage your personal information, security, and preferences.</p>
        </div>

        <div className="bg-theme-surface border border-theme-border rounded-[2rem] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 bg-theme-bg/50 border-r border-theme-border p-6 flex flex-col gap-2 shrink-0">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${activeTab === 'profile' ? 'bg-primary text-white font-bold shadow-md ring-1 ring-primary/20' : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text font-semibold border border-transparent'}`}
            >
              <User className="w-4 h-4" /> Profile Info
            </button>
            <button 
               onClick={() => setActiveTab('security')}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${activeTab === 'security' ? 'bg-primary text-white font-bold shadow-md ring-1 ring-primary/20' : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text font-semibold border border-transparent'}`}
            >
              <Shield className="w-4 h-4" /> Security
            </button>
            <button 
               onClick={() => setActiveTab('appearance')}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${activeTab === 'appearance' ? 'bg-primary text-white font-bold shadow-md ring-1 ring-primary/20' : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text font-semibold border border-transparent'}`}
            >
              <Palette className="w-4 h-4" /> Appearance
            </button>
          </div>

          <div className="flex-1 p-8 md:p-10">
            
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}
                  >
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    <p className="text-sm font-bold">{message.text}</p>
                  </motion.div>
                )}

                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-theme-text flex items-center gap-2">
                      Profile Information
                    </h3>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                       <div className="shrink-0 flex flex-col items-center gap-4">
                          <UserAvatar 
                            avatarId={currentUser.hasSelectedAvatar ? currentUser.avatarId : selectedAvatarId} 
                            size="xl" 
                            fallbackName={currentUser.fullName}
                            className="ring-4 ring-primary/10"
                          />
                          <p className="text-[10px] font-black text-theme-text-muted uppercase tracking-widest">Profile Preview</p>
                       </div>

                       <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-theme-text-muted uppercase tracking-widest pl-1">First Name</label>
                          <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={currentUser.hasUsedNameChange}
                            className={`w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium ${currentUser.hasUsedNameChange ? 'opacity-60 cursor-not-allowed bg-theme-bg/50' : ''}`} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-theme-text-muted uppercase tracking-widest pl-1">Last Name</label>
                          <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={currentUser.hasUsedNameChange}
                            className={`w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium ${currentUser.hasUsedNameChange ? 'opacity-60 cursor-not-allowed bg-theme-bg/50' : ''}`} 
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-theme-text-muted uppercase tracking-widest pl-1">Email Address</label>
                          <input type="email" defaultValue={currentUser.email} disabled className="w-full bg-theme-bg/50 border border-theme-border rounded-xl px-4 py-3 text-theme-text-muted font-medium cursor-not-allowed" />
                          <p className="text-xs text-theme-text-muted mt-2 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Email address cannot be changed.</p>
                        </div>
                      </div>
                    </div>

                    {currentUser.hasUsedNameChange ? (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-orange-600" />
                        <p className="text-sm font-bold text-orange-700">Display name has already been updated.</p>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <button 
                          onClick={handleUpdateName} 
                          disabled={isSaving} 
                          className="px-8 py-3.5 bg-theme-text text-theme-surface hover:opacity-90 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
                        >
                          {isSaving ? <>Updating Name...</> : <><Save className="w-4 h-4" /> Update Name</>}
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                <hr className="border-theme-border" />

                <section className="space-y-10 p-6 sm:p-8 bg-theme-bg/30 border border-theme-border rounded-[2.5rem]">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-theme-text mb-2 tracking-tight">Avatar Selection</h3>
                    <p className="text-sm text-theme-text-muted font-medium opacity-80 leading-relaxed">Choose your digital identity. This can only be done once.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-8 gap-y-10 justify-items-center max-w-2xl mx-auto md:mx-0">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar.id}
                        disabled={currentUser.hasSelectedAvatar}
                        onClick={() => handleSelectAvatar(avatar.id)}
                        className={`relative group p-0 rounded-full transition-all duration-300 ${
                          (currentUser.hasSelectedAvatar ? currentUser.avatarId === avatar.id : selectedAvatarId === avatar.id)
                            ? 'ring-4 ring-primary ring-offset-4 ring-offset-theme-surface scale-110 z-10' 
                            : 'hover:scale-105 z-0'
                        } ${(currentUser.hasSelectedAvatar && currentUser.avatarId !== avatar.id) ? 'opacity-30 grayscale pointer-events-none' : ''}`}
                      >
                        <UserAvatar 
                          avatarId={avatar.id} 
                          size="xl" 
                          className="shadow-md border border-theme-border"
                        />
                        
                        {/* Tooltip positioned above */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
                          <div className="relative">
                            <span className="bg-theme-text text-theme-surface text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl uppercase tracking-widest block">
                              {avatar.name}
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-theme-text rotate-45 -mt-1"></div>
                          </div>
                        </div>

                        {/* Selected Indicator Badge */}
                        {(currentUser.hasSelectedAvatar ? currentUser.avatarId === avatar.id : selectedAvatarId === avatar.id) && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-theme-surface shadow-lg animate-in zoom-in">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-center md:justify-start">
                    {currentUser.hasSelectedAvatar ? (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-4 flex items-center gap-3 w-full sm:w-fit shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                        <p className="text-sm font-bold text-green-700">Display identity has been locked.</p>
                      </div>
                    ) : (
                      <button 
                        onClick={handleSaveAvatar} 
                        disabled={isSaving || !selectedAvatarId} 
                        className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${!selectedAvatarId ? 'bg-theme-bg text-theme-text-muted cursor-not-allowed shadow-none border border-theme-border' : 'bg-primary hover:bg-orange-600 text-white hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0'}`}
                      >
                        {isSaving ? <>Securing Identity...</> : <><Save className="w-4 h-4" /> Finalize Profile Selection</>}
                      </button>
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <section className="space-y-12 max-w-3xl mx-auto flex flex-col items-center pt-8 pb-16">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                      <Palette className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-theme-text mb-2 tracking-tight">
                      Interface Theme
                    </h3>
                    <p className="text-theme-text-muted font-medium">Select your preferred visual experience.</p>
                  </div>

                  {/* Premium Segmented Switcher */}
                  <div className="bg-theme-bg/50 backdrop-blur-sm p-2 rounded-[2rem] flex flex-col sm:flex-row items-center justify-center border border-theme-border shadow-inner w-full relative sm:rounded-full gap-2 sm:gap-0">
                    {[
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'liquid-glass', label: 'Liquid Glass', icon: Sparkles },
                      { id: 'neon', label: 'Neon', icon: Zap }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={`relative w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-sm font-bold transition-all duration-300 outline-none ${
                          theme === t.id 
                            ? 'text-theme-text' 
                            : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface/50 focus:bg-theme-surface/50'
                        }`}
                      >
                        {theme === t.id && (
                          <motion.div 
                            layoutId="active-theme-pill"
                            className="absolute inset-0 bg-theme-surface border border-theme-text/10 rounded-full shadow-lg shadow-theme-text/5"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-2.5">
                          <t.icon className={`w-5 h-5 transition-colors duration-300 ${theme === t.id ? 'text-primary' : ''}`} />
                          {t.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <section className="space-y-6">
                  <h3 className="text-xl font-bold text-theme-text flex items-center gap-2">
                    Update Password
                  </h3>
                  
                  <div className="space-y-4">
                    {message && activeTab === 'security' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-700' : 'bg-red-500/10 border-red-500/20 text-red-700'}`}
                      >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        <p className="text-sm font-bold">{message.text}</p>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-theme-text-muted uppercase tracking-widest pl-1">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter current password" 
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium pr-12" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-theme-text-muted uppercase tracking-widest pl-1">New Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="New password" 
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-theme-text-muted uppercase tracking-widest pl-1">Confirm Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Confirm new password" 
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium" 
                          />
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-theme-text-muted hover:text-theme-text transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                    </button>
                  </div>
                  
                  <div className="pt-2">
                    <button onClick={handleUpdatePassword} disabled={isSaving} className="px-8 py-3.5 bg-theme-text text-theme-surface hover:opacity-90 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2">
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <><Save className="w-4 h-4" /> Save Password</>
                      )}
                    </button>
                  </div>
                </section>

                <hr className="border-theme-border" />

                <section className="space-y-6">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8 space-y-4">
                    <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-theme-text-muted text-sm font-medium">Once you delete your account, there is no going back. All your data, history, and earnings will be permanently erased. Please be certain.</p>
                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2 mt-4"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </section>
              </motion.div>
            )}

          </div>
        </div>

      </motion.div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
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
              className="bg-theme-surface border border-theme-border rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-theme-text flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" /> Confirm Deletion
                </h3>
                <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 text-theme-text-muted hover:text-theme-text rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-theme-text-muted text-sm font-medium">
                Are you absolutely sure you want to delete your account? This action cannot be undone. All earnings will be forfeited.
              </p>
              <div className="space-y-3">
                <label className="text-xs font-bold text-theme-text-muted uppercase tracking-widest">Type "DELETE" to confirm</label>
                <input 
                  type="text" 
                  placeholder="DELETE"
                  className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 font-mono" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 bg-theme-bg hover:bg-theme-border text-theme-text rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}
