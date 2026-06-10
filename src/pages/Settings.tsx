import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Shield, Eye, EyeOff, Save, ShieldAlert, User, Trash2, X, CheckCircle2 } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useUsers } from '../context/UserContext';
import { AVATARS } from '../constants/avatars';
import UserAvatar from '../components/UserAvatar';

export default function Settings() {
  const { currentUser, updateProfile, updatePassword } = useUsers();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
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
          <h2 className="text-3xl font-black text-gray-900 tracking-tight font-display mb-2">Account Settings</h2>
          <p className="text-gray-500 font-medium">Manage your personal information, security, and preferences.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col md:flex-row">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2 shrink-0">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'profile' ? 'bg-white text-primary font-bold shadow-sm border border-orange-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-semibold border border-transparent'}`}
            >
              <User className="w-4 h-4" /> Profile Info
            </button>
            <button 
               onClick={() => setActiveTab('security')}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'security' ? 'bg-white text-primary font-bold shadow-sm border border-orange-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-semibold border border-transparent'}`}
            >
              <Shield className="w-4 h-4" /> Security
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
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
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
                            className="ring-4 ring-orange-50"
                          />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Preview</p>
                       </div>

                       <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                          <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={currentUser.hasUsedNameChange}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium ${currentUser.hasUsedNameChange ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}`} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                          <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={currentUser.hasUsedNameChange}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium ${currentUser.hasUsedNameChange ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}`} 
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                          <input type="email" defaultValue={currentUser.email} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 font-medium cursor-not-allowed" />
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Email address cannot be changed.</p>
                        </div>
                      </div>
                    </div>

                    {currentUser.hasUsedNameChange ? (
                      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-orange-600" />
                        <p className="text-sm font-bold text-orange-700">Display name has already been updated.</p>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <button 
                          onClick={handleUpdateName} 
                          disabled={isSaving} 
                          className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2"
                        >
                          {isSaving ? <>Updating Name...</> : <><Save className="w-4 h-4" /> Update Name</>}
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                <hr className="border-gray-100" />

                <section className="space-y-10 p-6 sm:p-8 bg-gray-50/30 border border-gray-100 rounded-[2.5rem]">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Avatar Selection</h3>
                    <p className="text-sm text-gray-500 font-medium opacity-80 leading-relaxed">Choose your digital identity. This can only be done once.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-8 gap-y-10 justify-items-center max-w-2xl mx-auto md:mx-0">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar.id}
                        disabled={currentUser.hasSelectedAvatar}
                        onClick={() => handleSelectAvatar(avatar.id)}
                        className={`relative group p-0 rounded-full transition-all duration-300 ${
                          (currentUser.hasSelectedAvatar ? currentUser.avatarId === avatar.id : selectedAvatarId === avatar.id)
                            ? 'ring-4 ring-primary ring-offset-4 scale-110 z-10' 
                            : 'hover:scale-105 z-0'
                        } ${(currentUser.hasSelectedAvatar && currentUser.avatarId !== avatar.id) ? 'opacity-30 grayscale pointer-events-none' : ''}`}
                      >
                        <UserAvatar 
                          avatarId={avatar.id} 
                          size="xl" 
                          className="shadow-md border border-white"
                        />
                        
                        {/* Tooltip positioned above */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
                          <div className="relative">
                            <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl uppercase tracking-widest block">
                              {avatar.name}
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                          </div>
                        </div>

                        {/* Selected Indicator Badge */}
                        {(currentUser.hasSelectedAvatar ? currentUser.avatarId === avatar.id : selectedAvatarId === avatar.id) && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-white shadow-lg animate-in zoom-in">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-center md:justify-start">
                    {currentUser.hasSelectedAvatar ? (
                      <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-4 flex items-center gap-3 w-full sm:w-fit shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                        <p className="text-sm font-bold text-green-700">Display identity has been locked.</p>
                      </div>
                    ) : (
                      <button 
                        onClick={handleSaveAvatar} 
                        disabled={isSaving || !selectedAvatarId} 
                        className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${!selectedAvatarId ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-orange-600 text-white hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0'}`}
                      >
                        {isSaving ? <>Securing Identity...</> : <><Save className="w-4 h-4" /> Finalize Profile Selection</>}
                      </button>
                    )}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <section className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Update Password
                  </h3>
                  
                  <div className="space-y-4">
                    {message && activeTab === 'security' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}
                      >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        <p className="text-sm font-bold">{message.text}</p>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Enter current password" 
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium pr-12" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">New Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="New password" 
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Confirm new password" 
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium" 
                          />
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                    </button>
                  </div>
                  
                  <div className="pt-2">
                    <button onClick={handleUpdatePassword} disabled={isSaving} className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2">
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <><Save className="w-4 h-4" /> Save Password</>
                      )}
                    </button>
                  </div>
                </section>

                <hr className="border-gray-100" />

                <section className="space-y-6">
                  <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 space-y-4">
                    <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-gray-600 text-sm font-medium">Once you delete your account, there is no going back. All your data, history, and earnings will be permanently erased. Please be certain.</p>
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
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" /> Confirm Deletion
                </h3>
                <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 text-sm font-medium">
                Are you absolutely sure you want to delete your account? This action cannot be undone. All earnings will be forfeited.
              </p>
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Type "DELETE" to confirm</label>
                <input 
                  type="text" 
                  placeholder="DELETE"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 font-mono" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
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
