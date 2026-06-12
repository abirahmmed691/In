import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { FileText, Scale, Gavel, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Terms() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-primary mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-theme-text font-display tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-theme-text-muted font-medium italic">Last Updated: June 9, 2026</p>
          </motion.div>

          <div className="prose prose-orange max-w-none">
            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 mb-12 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-theme-text mb-2">Important Notice</h3>
                <p className="text-theme-text-muted text-sm leading-relaxed">
                  Please read these terms carefully before accessing or using our services. By using {settings.name}, you agree to be bound by these terms. If you do not agree to all the terms and conditions, then you may not access the website or use any services.
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-theme-text-muted opacity-60" />
                Electronic Communications
              </h2>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                Visiting {settings.name} or sending emails to {settings.name} constitutes electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communications be in writing.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <Gavel className="w-6 h-6 text-theme-text-muted opacity-60" />
                Your Account
              </h2>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. You may not assign or otherwise transfer your account to any other person or entity.
              </p>
              <div className="bg-theme-bg p-6 rounded-2xl border border-theme-border">
                <h4 className="font-bold text-theme-text mb-3 text-sm">Eligibility Criteria:</h4>
                <ul className="text-sm text-theme-text-muted space-y-2 list-disc pl-5">
                  <li>You must be at least 18 years of age (or the minimum legal age in your country).</li>
                  <li>You must provide accurate and complete registration information.</li>
                  <li>You must not have been previously suspended or removed from our platform.</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-hover flex items-center justify-center text-theme-text-muted text-sm">3</div>
                Survey Participation and Rewards
              </h2>
              <p className="text-theme-text-muted leading-relaxed mb-4">
                Rewards are credited to your account after successful completion of a survey as verified by our survey partners. We reserve the right to withhold rewards if we detect fraudulent activity, inconsistent answers, or violation of specific survey guidelines.
              </p>
              <p className="text-theme-text-muted leading-relaxed">
                Rewards have no cash value until they reach the minimum withdrawal threshold. Withdrawal methods and minimums are subject to change without prior notice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-theme-text mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-theme-surface-hover flex items-center justify-center text-theme-text-muted text-sm">4</div>
                Termination/Access Restriction
              </h2>
              <p className="text-theme-text-muted leading-relaxed">
                {settings.name} reserves the right, in its sole discretion, to terminate your access to the Site and the related services or any portion thereof at any time, without notice. To the maximum extent permitted by law, this agreement is governed by the laws of the State of California.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
