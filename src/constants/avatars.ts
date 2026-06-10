export interface Avatar {
  id: string;
  name: string;
  url: string;
}

export const AVATARS: Avatar[] = [
  // Professional / Business
  { id: 'pro-male-1', name: 'Business Executive (Male)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4' },
  { id: 'pro-female-1', name: 'Business Executive (Female)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf' },
  { id: 'pro-male-2', name: 'Young Professional (Male)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George&backgroundColor=c0aede' },
  { id: 'pro-female-2', name: 'Young Professional (Female)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=d1d4f9' },
  
  // Casual / Modern
  { id: 'cas-male-1', name: 'Casual Modern (Male)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Toby&backgroundColor=b6e3f4' },
  { id: 'cas-female-1', name: 'Casual Modern (Female)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow&backgroundColor=ffdfbf' },
  { id: 'cas-male-2', name: 'Creative Male', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb&backgroundColor=c0aede' },
  { id: 'cas-female-2', name: 'Creative Female', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=d1d4f9' },
  
  // Tech / Creator
  { id: 'tech-male-1', name: 'Tech Specialist (Male)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=b6e3f4' },
  { id: 'tech-female-1', name: 'Tech Specialist (Female)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=ffdfbf' },
  { id: 'creator-male', name: 'Digital Creator (Male)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=c0aede' },
  { id: 'creator-female', name: 'Digital Creator (Female)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala&backgroundColor=d1d4f9' },
  
  // Diverse / Stylish
  { id: 'style-male-1', name: 'Stylish Male', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=b6e3f4' },
  { id: 'style-female-1', name: 'Stylish Female', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bibi&backgroundColor=ffdfbf' },
  { id: 'style-male-2', name: 'Modern Minimalist (Male)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pepper&backgroundColor=c0aede' },
  { id: 'style-female-2', name: 'Modern Minimalist (Female)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=d1d4f9' },
];
