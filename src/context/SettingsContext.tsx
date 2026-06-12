import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  logoUrl?: string;
  enabled: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  url: string;
  order: number;
  enabled: boolean;
  showOnLandingPage: boolean;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  type: 'survey' | 'offerwall';
  active: boolean;
  order: number;
  statusText?: string;
  themeColor?: string;
  providerUrl?: string;
  iframeUrl?: string;
  apiKey?: string;
  postbackUrl?: string;
  featured?: boolean;
}

interface WebsiteSettings {
  name: string;
  tagline: string;
  logoText: string;
  favicon: string;
  copyright: string;
  supportEmail: string;
  businessEmail: string;
  social: SocialPlatform[];
  paymentMethods: PaymentMethod[];
  providers: Provider[];
  legalPages: {
    privacy: { title: string; content: string };
    terms: { title: string; content: string };
    cookies: { title: string; content: string };
  };
}

interface SettingsContextType {
  settings: WebsiteSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: WebsiteSettings = {
  name: 'SurveyEarn',
  tagline: 'Get rewarded for your opinion',
  logoText: 'S',
  favicon: 'S',
  copyright: '© 2026 SurveyEarn. All rights reserved.',
  supportEmail: 'support@surveyearn.com',
  businessEmail: 'biz@surveyearn.com',
  social: [],
  paymentMethods: [],
  providers: [],
  legalPages: {
    privacy: { title: 'Privacy Policy', content: '' },
    terms: { title: 'Terms of Service', content: '' },
    cookies: { title: 'Cookie Policy', content: '' }
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    // 1. Fetch general settings
    const { data: generalData } = await supabase
      .from('website_settings')
      .select('*');
    
    // 2. Fetch providers
    const { data: surveyProviders } = await supabase.from('survey_providers').select('*');
    const { data: offerwallProviders } = await supabase.from('offerwall_providers').select('*');

    const mappedSettings = { ...defaultSettings };
    
    if (generalData) {
      generalData.forEach(item => {
        if (item.key in mappedSettings) {
          (mappedSettings as any)[item.key] = item.value;
        }
      });
    }

    const providers: Provider[] = [];
    surveyProviders?.forEach(p => providers.push({
      id: p.id,
      name: p.name,
      slug: p.slug,
      logoUrl: p.logo_url,
      description: p.description,
      type: 'survey',
      active: p.active,
      order: p.priority,
      featured: p.featured,
      providerUrl: p.provider_url,
      iframeUrl: p.iframe_url,
      apiKey: p.api_key,
      postbackUrl: p.postback_url
    }));

    offerwallProviders?.forEach(p => providers.push({
      id: p.id,
      name: p.name,
      slug: p.slug,
      logoUrl: p.logo_url,
      description: p.description,
      type: 'offerwall',
      active: p.active,
      order: p.priority,
      featured: p.featured,
      providerUrl: p.provider_url,
      iframeUrl: p.iframe_url,
      apiKey: p.api_key,
      postbackUrl: p.postback_url
    }));

    mappedSettings.providers = providers;
    setSettings(mappedSettings);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    // This is simplified: in reality you'd update specific rows
    // For this migration, we'll iterate through keys
    const keys = Object.keys(newSettings);
    for (const key of keys) {
      if (key === 'providers') continue; // Handled separately in admin if needed

      await supabase
        .from('website_settings')
        .upsert({ key, value: (newSettings as any)[key] });
    }

    await refreshSettings();
  };

  useEffect(() => {
    if (settings.name) {
      document.title = settings.name;
    }
  }, [settings.name]);

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      isLoading,
      updateSettings, 
      refreshSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
