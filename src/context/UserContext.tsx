import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { trackLoginHistory } from '../utils/loginTracking';
import { User } from '@supabase/supabase-js';

export type UserStatus = 'Active' | 'Banned';

export interface AppUser {
  id: string;
  email: string;
  profileSurveyCompleted?: boolean;
  profileSurveyData?: Record<string, any>;
  firstName: string;
  lastName: string;
  fullName: string;
  status: UserStatus;
  joinDate: string;
  avatarId: string | null;
  nameUpdatedAt: string | null;
  hasUsedNameChange: boolean;
  avatarSelectedAt: string | null;
  hasSelectedAvatar: boolean;
  isAdmin?: boolean;
  referredBy?: string | null;
}

interface UserContextType {
  users: AppUser[];
  currentUser: AppUser | null;
  isLoading: boolean;
  referralCount: number;
  addUser: (data: any, referralCode?: string) => Promise<{ success: boolean; error?: string }>;
  updateUserStatus: (id: string, status: UserStatus) => Promise<void>;
  updateProfile: (updates: Partial<Pick<AppUser, 'firstName' | 'lastName' | 'avatarId'>>) => Promise<{ success: boolean; error?: string }>;
  getUserById: (id: string) => Promise<AppUser | undefined>;
  verifyReferralCode: (code: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  submitProfileSurvey: (data: Record<string, any>) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReferralCount = async (userId: string) => {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', userId);
    
    if (!error && count !== null) {
      setReferralCount(count);
    }
  };

  useEffect(() => {
    let mounted = true;

    const setupSession = async () => {
      try {
        console.log('setupSession start');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          await fetchReferralCount(session.user.id);
        } else {
          if (mounted) setCurrentUser(null);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    setupSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('onAuthStateChange triggered event:', event);
      if (event === 'INITIAL_SESSION') return; // Handled by setupSession
      
      try {
        if (session?.user) {
          if (event === 'SIGNED_IN') {
             // Track login
             trackLoginHistory(session.user.id);
          }
          // If we are currently loading the same user, it might be redundant, but safe
          await fetchProfile(session.user.id);
          await fetchReferralCount(session.user.id);
        } else {
          if (mounted) {
             setCurrentUser(null);
             // When explicitly logged out, ensure we render the null state quickly 
             setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Error in onAuthStateChange:', err);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, retries = 3) => {
    console.log('fetchProfile start for userId:', userId);
    
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('PROFILE', profile);
      console.log('IS ADMIN', profile?.is_admin);

      if (profile && !error) {
        // Normalize status to Title Case
        const normalizedStatus = profile.status ? (profile.status.charAt(0).toUpperCase() + profile.status.slice(1).toLowerCase()) : 'Active';
        
        // If names are empty but we have metadata from a social provider, update them
        if (!profile.first_name && !profile.last_name) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.user_metadata) {
            const meta = session.user.user_metadata;
            const firstName = meta.full_name?.split(' ')[0] || meta.name?.split(' ')[0] || meta.given_name || '';
            const lastName = meta.full_name?.split(' ').slice(1).join(' ') || meta.name?.split(' ').slice(1).join(' ') || meta.family_name || '';
            
            if (firstName || lastName) {
              await supabase
                .from('users')
                .update({ 
                  first_name: firstName, 
                  last_name: lastName 
                })
                .eq('id', userId);
              
              // Re-fetch to get updated values
              return fetchProfile(userId);
            }
          }
        }

        setCurrentUser({
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          fullName: profile.full_name || '',
          status: normalizedStatus as UserStatus,
          joinDate: profile.created_at,
          avatarId: profile.avatar_id,
          profileSurveyCompleted: profile.profile_survey_completed,
          profileSurveyData: profile.profile_survey_data,
          isAdmin: profile.is_admin,
          referredBy: profile.referred_by,
          nameUpdatedAt: profile.updated_at,
          hasUsedNameChange: !!profile.first_name,
          avatarSelectedAt: profile.updated_at,
          hasSelectedAvatar: !!profile.avatar_id
        });
        console.log('fetchProfile setCurrentUser done.');
      } else if (error) {
        throw error;
      }
    } catch (error: any) {
      if (retries > 0) {
        console.warn(`Profile fetch failed, retrying in 1s... (${retries} attempts left)`);
        setTimeout(() => fetchProfile(userId, retries - 1), 1000);
      } else {
        // Only log error as a debug or less severe warning to avoid noise
        // if we have exhausted retries and it's a TypeError (usually network drop).
        if (error.message?.includes('Failed to fetch')) {
          console.warn('Network timeout fetching profile (ignoring to prevent console noise):', error.message);
        } else {
          console.error('Error fetching profile after retries:', error);
        }
      }
    }
  };

  const refreshUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (data && !error) {
      setUsers(data.map(u => {
        const normalizedStatus = u.status ? (u.status.charAt(0).toUpperCase() + u.status.slice(1).toLowerCase()) : 'Active';
        return {
          id: u.id,
          email: u.email,
          firstName: u.first_name,
          lastName: u.last_name,
          fullName: u.full_name,
          status: normalizedStatus as UserStatus,
          joinDate: u.created_at,
          avatarId: u.avatar_id,
          profileSurveyCompleted: u.profile_survey_completed,
          profileSurveyData: u.profile_survey_data,
          isAdmin: u.is_admin,
          referredBy: u.referred_by,
          nameUpdatedAt: u.updated_at,
          hasUsedNameChange: !!u.first_name,
          avatarSelectedAt: u.updated_at,
          hasSelectedAvatar: !!u.avatar_id
        };
      }));
    }
  };

  const addUser = async (data: any, referralCode?: string) => {
    const { email, password, firstName, lastName } = data;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return { success: false, error: authError.message };
    if (!authData.user) return { success: false, error: 'Signup failed' };

    // Trigger in Supabase handles inserting into 'users' table, 
    // but let's update names immediately
    const { error: profileError } = await supabase
      .from('users')
      .update({ 
        first_name: firstName, 
        last_name: lastName,
        referred_by: referralCode && referralCode.trim() !== '' && referralCode !== authData.user.id ? referralCode : null
      })
      .eq('id', authData.user.id);

    if (profileError) return { success: false, error: profileError.message };

    return { success: true };
  };

  const verifyReferralCode = async (code: string) => {
    if (!code || code.length < 30) return false; // Basic UUID length check
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', code)
      .single();
    return !!data && !error;
  };

  const updateProfile = async (updates: Partial<Pick<AppUser, 'firstName' | 'lastName' | 'avatarId'>>) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    const dbUpdates: any = {};
    if (updates.firstName) dbUpdates.first_name = updates.firstName;
    if (updates.lastName) dbUpdates.last_name = updates.lastName;
    if (updates.avatarId) dbUpdates.avatar_id = updates.avatarId;

    const { error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', currentUser.id);

    if (error) return { success: false, error: error.message };

    await fetchProfile(currentUser.id);
    return { success: true };
  };

  const updateUserStatus = async (id: string, status: UserStatus) => {
    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id);
    if (error) {
      console.error('Error updating user status:', error);
    }
    await refreshUsers();
  };

  const getUserById = async (id: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
        // Normalize status to Title Case to match UserStatus enum
        const normalizedStatus = data.status ? (data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()) : 'Active';
        return {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            fullName: data.full_name,
            status: normalizedStatus,
            joinDate: data.created_at,
            avatarId: data.avatar_id,
            profileSurveyCompleted: data.profile_survey_completed,
            profileSurveyData: data.profile_survey_data,
            isAdmin: data.is_admin,
            referredBy: data.referred_by,
            nameUpdatedAt: data.updated_at,
            hasUsedNameChange: !!data.first_name,
            avatarSelectedAt: data.updated_at,
            hasSelectedAvatar: !!data.avatar_id
        } as AppUser;
    }
    return undefined;
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    
    if (data.session?.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('status')
        .eq('id', data.session.user.id)
        .single();

      if (profile) {
        const normalizedStatus = profile.status ? (profile.status.charAt(0).toUpperCase() + profile.status.slice(1).toLowerCase()) : 'Active';
        if (normalizedStatus === 'Banned') {
          await supabase.auth.signOut();
          return { success: false, error: 'Your account has been banned. Please contact support.' };
        }
      }

      await fetchProfile(data.session.user.id);
    }
    
    return { success: true };
  };

  const loginWithGoogle = async (redirectTo?: string) => {
    const origin = window.location.origin;
    // Ensure the redirect URL is valid for Supabase (must be in whitelist)
    const targetUrl = redirectTo ? `${origin}${redirectTo}` : origin;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const updatePassword = async (_currentPassword: string, newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const submitProfileSurvey = async (data: Record<string, any>) => {
    if (!currentUser) return;

    // 1. Insert/Upsert into profile_surveys table
    const { error: surveyError } = await supabase
      .from('profile_surveys')
      .upsert({ user_id: currentUser.id, data });

    if (surveyError) {
        console.error('Error submitting survey:', surveyError);
        return;
    }

    // 2. Mark completed in users table
    await supabase
      .from('users')
      .update({ profile_survey_completed: true })
      .eq('id', currentUser.id);

    await fetchProfile(currentUser.id);
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      currentUser, 
      isLoading,
      referralCount,
      addUser, 
      updateUserStatus, 
      updateProfile, 
      getUserById, 
      verifyReferralCode,
      login, 
      loginWithGoogle,
      logout, 
      updatePassword, 
      submitProfileSurvey,
      refreshUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
