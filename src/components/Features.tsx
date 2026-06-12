import { motion } from 'motion/react';
import { Target, Zap, ArrowRightLeft, Gift, ShieldCheck, Activity } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'High Paying Surveys',
      description: 'We partner with top market research brands to bring you surveys that value your time and pay top dollar.',
      icon: Target,
    },
    {
      title: 'Daily New Opportunities',
      description: 'Your dashboard is refreshed daily with new chances to earn. Never run out of ways to make money.',
      icon: Zap,
    },
    {
      title: 'Fast Withdrawals',
      description: 'Request a cash out and receive your rewards within 24 hours. Choose from PayPal, crypto, or gift cards.',
      icon: ArrowRightLeft,
    },
    {
      title: 'Referral Rewards',
      description: 'Invite your friends and earn a percentage of their survey earnings for life. Built-in viral growth.',
      icon: Gift,
    },
    {
      title: 'Secure Platform',
      description: 'Your data is encrypted and protected. We strictly adhere to privacy laws and never sell personal identifiable information.',
      icon: ShieldCheck,
    },
    {
      title: 'Real-Time Tracking',
      description: 'Watch your balance grow in real-time. Detailed analytics and history to track your earning performance.',
      icon: Activity,
    },
  ];

  return (
    <section id="surveys" className="py-24 bg-theme-surface relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-50/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/40 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold text-theme-text font-display tracking-tight mb-4"
          >
            Why Users Choose SurveyEarn
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-theme-text-muted"
          >
            Everything you need to maximize your rewards.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-theme-surface rounded-3xl p-8 shadow-sm border border-theme-border hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-100 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-inner">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-theme-text mb-3">{feature.title}</h3>
              <p className="text-theme-text-muted leading-relaxed font-medium text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
