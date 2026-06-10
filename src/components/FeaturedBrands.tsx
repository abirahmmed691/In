import { motion } from 'motion/react';

export default function FeaturedBrands() {
  const brands = [
    { name: 'CPX Research' },
    { name: 'BitLabs' },
    { name: 'Pollfish' },
    { name: 'InBrain' },
    { name: 'Wannads' },
    { name: 'Offerwall.me' },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"
        >
          Trusted Research Partners
        </motion.p>
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm font-medium text-gray-500 mb-10"
        >
          Powered by leading survey and offerwall providers.
        </motion.p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 sm:gap-x-16 md:gap-x-20">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-black text-gray-700 hover:text-primary transition-colors tracking-tight font-display">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
