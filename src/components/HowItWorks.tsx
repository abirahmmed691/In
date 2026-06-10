import { motion } from 'motion/react';
import { UserPlus, ClipboardList, Wallet } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Create Free Account',
      description: 'Sign up in seconds. No credit card required, ever. Complete your profile to get the best survey matches.',
      icon: UserPlus,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 2,
      title: 'Complete Surveys',
      description: 'Get matched with high-paying surveys from top brands. Share your honest opinion and help shape future products.',
      icon: ClipboardList,
      color: 'bg-primary/10 text-primary',
    },
    {
      id: 3,
      title: 'Get Paid Instantly',
      description: 'Cash out your rewards via PayPal, Amazon gift cards, or crypto. Enjoy fast, reliable payouts with low minimums.',
      icon: Wallet,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display tracking-tight mb-4"
          >
            Start Earning in 3 Simple Steps
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            Getting started takes less than 2 minutes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="relative group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-100 transition-all duration-300"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 ${step.color}`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {step.id}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
