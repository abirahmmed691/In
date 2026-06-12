import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Privacy() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-theme-text font-display tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-theme-text-muted font-medium italic">Last Updated: June 9, 2026</p>
          </motion.div>

          <div className="prose prose-orange max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-hover flex items-center justify-center text-theme-text-muted text-sm">1</div>
                Introduction
              </h2>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                At {settings.name}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {settings.name} and how we use it.
              </p>
              <p className="text-theme-text-muted leading-relaxed">
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in {settings.name}.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-hover flex items-center justify-center text-theme-text-muted text-sm">2</div>
                Consent
              </h2>
              <p className="text-theme-text-muted leading-relaxed">
                By using our website, you hereby consent to our Privacy Policy and agree to its terms. When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-hover flex items-center justify-center text-theme-text-muted text-sm">3</div>
                Information we collect
              </h2>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-theme-text-muted">
                <li>Identify and prevent fraud</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners</li>
              </ul>
            </section>

            <section className="mb-12">
              <div className="p-8 bg-theme-bg rounded-[2rem] border border-theme-border">
                <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-primary" />
                  Data Protection Rights
                </h2>
                <p className="text-theme-text-muted leading-relaxed mb-4">
                  We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-theme-surface p-5 rounded-2xl shadow-sm border border-theme-border">
                    <h4 className="font-bold text-theme-text mb-2">Right to Access</h4>
                    <p className="text-sm text-theme-text-muted">You have the right to request copies of your personal data.</p>
                  </div>
                  <div className="bg-theme-surface p-5 rounded-2xl shadow-sm border border-theme-border">
                    <h4 className="font-bold text-theme-text mb-2">Right to Rectification</h4>
                    <p className="text-sm text-theme-text-muted">You have the right to request that we correct any information you believe is inaccurate.</p>
                  </div>
                  <div className="bg-theme-surface p-5 rounded-2xl shadow-sm border border-theme-border">
                    <h4 className="font-bold text-theme-text mb-2">Right to Erasure</h4>
                    <p className="text-sm text-theme-text-muted">You have the right to request that we erase your personal data, under certain conditions.</p>
                  </div>
                  <div className="bg-theme-surface p-5 rounded-2xl shadow-sm border border-theme-border">
                    <h4 className="font-bold text-theme-text mb-2">Right to Object</h4>
                    <p className="text-sm text-theme-text-muted">You have the right to object to our processing of your personal data.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-hover flex items-center justify-center text-theme-text-muted text-sm">4</div>
                Third Party Privacy Policies
              </h2>
              <p className="text-theme-text-muted leading-relaxed">
                {settings.name}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
