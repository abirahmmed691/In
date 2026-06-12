import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Cookie, MousePointer2, Settings, Info } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Cookies() {
  const { settings } = useSettings();
  return (
    <div className="min-h-screen bg-theme-surface">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-100 text-orange-600 mb-6">
              <Cookie className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-theme-text font-display tracking-tight mb-4">
              Cookie Policy
            </h1>
            <p className="text-theme-text-muted font-medium italic">Last Updated: June 9, 2026</p>
          </motion.div>

          <div className="prose prose-orange max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-theme-text-muted opacity-60" />
                What Are Cookies
              </h2>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.
              </p>
              <p className="text-theme-text-muted leading-relaxed">
                We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-theme-text-muted opacity-60" />
                How We Use Cookies
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <MousePointer2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-theme-text mb-2">Essential Cookies</h4>
                  <p className="text-sm text-theme-text-muted leading-relaxed">These cookies are necessary for the website to function and cannot be switched off in our systems.</p>
                </div>
                <div className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-theme-text mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-theme-text-muted leading-relaxed">We use these to measure how visitors interact with our site, which helps us improve performance.</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-hover flex items-center justify-center text-theme-text-muted text-sm">3</div>
                Disabling Cookies
              </h2>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
              </p>
              <div className="p-6 bg-theme-bg rounded-2xl border border-theme-border italic text-sm text-theme-text-muted">
                "Disabling cookies will usually result in also disabling certain functionality and features of the this site."
              </div>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-theme-text mb-4">Third Party Cookies</h3>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 p-4 border border-theme-border rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-theme-text block mb-1">Google Analytics</span>
                    <p className="text-sm text-theme-text-muted">Used to track and measure usage of this site so that we can continue to produce engaging content.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 border border-theme-border rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-theme-text block mb-1">Stripe</span>
                    <p className="text-sm text-theme-text-muted">Necessary for processing payments and ensuring secure financial transactions.</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
