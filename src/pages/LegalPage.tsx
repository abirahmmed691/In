import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { ChevronLeft, ShieldCheck, ScrollText, Cookie } from 'lucide-react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();

  const getPageData = () => {
    if (!settings.legalPages) return null;
    
    switch (slug) {
      case 'privacy-policy':
        return settings.legalPages.privacy ? { ...settings.legalPages.privacy, icon: ShieldCheck } : null;
      case 'terms-of-service':
        return settings.legalPages.terms ? { ...settings.legalPages.terms, icon: ScrollText } : null;
      case 'cookie-policy':
        return settings.legalPages.cookies ? { ...settings.legalPages.cookies, icon: Cookie } : null;
      default:
        return null;
    }
  };

  const page = getPageData();

  if (!page) {
    return (
      <div className="min-h-screen bg-theme-surface flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-theme-text mb-4">404</h1>
          <p className="text-theme-text-muted mb-8">The legal page you are looking for does not exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-theme-text text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const Icon = page.icon;

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-bold text-theme-text-muted hover:text-theme-text transition-colors mt-8 mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-theme-surface rounded-2xl flex items-center justify-center shadow-sm border border-theme-border">
                <Icon className="w-8 h-8 text-theme-text" />
              </div>
              <h1 className="text-4xl font-black text-theme-text tracking-tight">{page.title}</h1>
            </div>
            
            <p className="text-theme-text-muted font-medium border-l-4 border-gray-900 pl-4 py-1 italic">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-theme-surface rounded-3xl border border-theme-border shadow-sm p-12 overflow-hidden"
          >
            <div className="prose prose-gray max-w-none prose-headings:text-theme-text prose-headings:font-black prose-p:text-theme-text-muted prose-p:leading-relaxed prose-strong:text-theme-text prose-a:text-theme-text prose-a:font-bold prose-a:underline hover:prose-a:text-theme-text">
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
          </motion.div>

          <div className="mt-12 text-center">
             <p className="text-sm text-theme-text-muted opacity-60 font-medium tracking-tight">
               Have questions about our policies? <Link to="/contact" className="text-theme-text font-bold underline hover:text-theme-text transition-colors">Contact our support team</Link>
             </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
