import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Twitter, Instagram, Github, Youtube, MessageSquare, ArrowRight, Check, Share2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigate = useNavigate();
  const location = useLocation();

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Surveys', id: 'surveys' },
    { name: 'Rewards', id: 'rewards' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
  ];

  const legalLinks = [
    { name: settings.legalPages?.privacy?.title || 'Privacy Policy', href: '/legal/privacy-policy' },
    { name: settings.legalPages?.terms?.title || 'Terms of Service', href: '/legal/terms-of-service' },
    { name: settings.legalPages?.cookies?.title || 'Cookie Policy', href: '/legal/cookie-policy' },
  ];

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const socialLinks = (Array.isArray(settings.social) ? settings.social : [])
    .filter(platform => platform.enabled)
    .map(platform => {
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
      return {
        icon: getIcon(platform.name),
        href: platform.url,
        logoUrl: platform.logoUrl,
      };
    });

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <footer id="contact" className="bg-gray-900 pt-20 pb-10 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-2xl uppercase">
                {settings.logoText}
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                {settings.name}
              </span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">
              {settings.tagline}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 overflow-hidden"
                >
                  {social.logoUrl ? (
                    <img src={social.logoUrl} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <social.icon className="w-5 h-5" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 lg:offset-1">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  {link.id === 'contact' ? (
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-primary transition-colors font-medium text-sm"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-gray-400 hover:text-primary transition-colors font-medium text-sm"
                    >
                      {link.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary transition-colors font-medium text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support/Newsletter simulation */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Newsletter</h4>
            <p className="text-gray-400 text-xs font-medium mb-4">Get the latest survey opportunities delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  className={`bg-gray-800 border-none text-white text-sm px-4 py-2 rounded-l-lg w-full focus:ring-1 outline-none transition-all ${status === 'error' ? 'ring-1 ring-red-500' : 'focus:ring-primary'}`}
                />
                <button 
                  type="submit"
                  disabled={status === 'success'}
                  className={`bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center min-w-[48px] ${status === 'success' ? 'bg-emerald-500' : ''}`}
                >
                  {status === 'success' ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {status === 'success' && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 mt-2 text-[10px] font-bold text-emerald-400"
                  >
                    Thank you for subscribing.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 mt-2 text-[10px] font-bold text-red-400"
                  >
                    Please enter a valid email.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            {settings.copyright}
          </p>
          <div className="flex items-center gap-6">
             <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Global Rewards System</span>
             <div className="flex gap-2">
                <div className="w-8 h-5 bg-gray-800 rounded border border-gray-700 opacity-50"></div>
                <div className="w-8 h-5 bg-gray-800 rounded border border-gray-700 opacity-50"></div>
                <div className="w-8 h-5 bg-gray-800 rounded border border-gray-700 opacity-50"></div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
