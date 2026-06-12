-- SUPABASE SCHEMA SETUP
-- Run this in your Supabase SQL Editor

-- 1. Create a helper function to check if the current user is an admin
-- SECURITY DEFINER bypasses RLS for the internal query
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. USERS TABLE (Extends Auth.Users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  avatar_id TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Banned')),
  profile_survey_completed BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Non-recursive policy for users
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id OR public.is_admin());

-- Optional: Admins can do everything else if and only if you want full admin control via RLS
CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
USING (public.is_admin());

-- 2. SURVEY PROVIDERS
CREATE TABLE public.survey_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  iframe_url TEXT,
  provider_url TEXT,
  api_key TEXT,
  postback_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Providers
ALTER TABLE public.survey_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active providers" ON public.survey_providers FOR SELECT USING (active = TRUE);
CREATE POLICY "Admins can manage providers" ON public.survey_providers FOR ALL USING (
  public.is_admin()
);

-- 3. OFFERWALL PROVIDERS (Similar to Survey Providers)
CREATE TABLE public.offerwall_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  iframe_url TEXT,
  provider_url TEXT,
  api_key TEXT,
  postback_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.offerwall_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active offerwalls" ON public.offerwall_providers FOR SELECT USING (active = TRUE);
CREATE POLICY "Admins can manage offerwalls" ON public.offerwall_providers FOR ALL USING (
  public.is_admin()
);

-- 4. TRANSACTIONS
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Survey Reward', 'Offer Reward', 'Withdrawal Request', 'Withdrawal Approval', 'Withdrawal Rejection', 'Manual Credit', 'Chargeback')),
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending', 'Rejected')),
  provider_id UUID, -- Optional link to provider
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all transactions" ON public.transactions FOR ALL USING (
  public.is_admin()
);

-- 5. WITHDRAWALS
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  method TEXT NOT NULL,
  details TEXT, -- Wallet address or email
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  transaction_id UUID REFERENCES public.transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- RLS for Withdrawals
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all withdrawals" ON public.withdrawals FOR ALL USING (
  public.is_admin()
);

-- 6. PROFILE SURVEYS
CREATE TABLE public.profile_surveys (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profile_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile survey" ON public.profile_surveys FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profile surveys" ON public.profile_surveys FOR SELECT USING (
  public.is_admin()
);

-- 7. NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'Info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 8. REFERRALS
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.users(id) NOT NULL,
  referred_id UUID REFERENCES public.users(id) UNIQUE NOT NULL,
  earnings DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referral data" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- 9. WEBSITE SETTINGS
CREATE TABLE public.website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.website_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage settings" ON public.website_settings FOR ALL USING (
  public.is_admin()
);

-- FUNCTON: Handle Auto-Create User Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (new.id, new.email, '', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
