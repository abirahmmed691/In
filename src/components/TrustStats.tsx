import { motion } from 'motion/react';

export default function TrustStats() {
  const stats = [
    { label: 'Active Members', value: '5,000+' },
    { label: 'Paid to Users', value: '$100,000+' },
    { label: 'Surveys Completed', value: '500,000+' },
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-gray-900 via-[#0a0f1c] to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)] pointer-events-none" />
      
      {/* Soft glow in the middle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 md:divide-x divide-gray-800">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center px-4"
            >
              <h4 className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-3 tracking-tight">
                {stat.value}
              </h4>
              <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
