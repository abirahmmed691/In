import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Payouts() {
  const { settings } = useSettings();
  
  const payoutMethods = settings.paymentMethods
    .filter(method => method.enabled && method.showOnLandingPage)
    .sort((a, b) => a.order - b.order);

  const trustBadges = [
    'Fast Withdrawals',
    'Secure Payments',
    'Multiple Reward Options',
  ];

  return (
    <section id="rewards" className="py-24 bg-gradient-to-br from-[#062c1f] via-[#041a13] to-[#062c1f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold text-white font-display tracking-tight mb-6"
          >
            Fast & Flexible Payouts
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-emerald-100/70"
          >
            Withdraw cash or redeem rewards from dozens of popular brands.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {payoutMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 flex flex-col items-center justify-center group hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-black/20 overflow-hidden p-3">
                <img 
                  src={method.logo} 
                  alt={method.name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-sm font-bold text-emerald-50/90 text-center tracking-tight">
                {method.name}
              </span>
            </motion.div>
          ))}

          {/* Large Special Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: payoutMethods.length * 0.1 }}
            className="bg-primary/20 backdrop-blur-md border border-primary/30 rounded-[2.5rem] p-6 flex flex-col items-center justify-center group hover:bg-primary/30 hover:border-primary/40 transition-all duration-300 col-span-2 md:col-span-1 lg:col-span-1"
          >
             <div className="text-center">
                <p className="text-3xl font-black text-white font-display mb-1 group-hover:scale-110 transition-transform">50+</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Gift Cards</p>
             </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 pt-12 border-t border-white/5">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-emerald-50/80 tracking-wide">
                {badge}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
