import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

function TrustpilotRating({ rating, date }: { rating: number; date: string }) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => {
            // Calculate fill percentage for each block
            const fillWidth = Math.max(0, Math.min(1, rating - (i - 1))) * 100;
            return (
              <div key={i} className="w-6 h-6 bg-[#e1e4e4] relative overflow-hidden rounded-sm">
                <div 
                  className="absolute inset-0 bg-[#00b67a]" 
                  style={{ width: `${fillWidth}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            );
          })}
        </div>
        <span className="text-sm font-black text-gray-900 tracking-tight">{rating}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-100 md:hidden" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] shrink-0">
          Review from {date}
        </span>
        <div className="h-px flex-1 bg-gray-100 hidden md:block" />
      </div>
    </div>
  );
}

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'USA',
      text: "I've earned over $200 in just a few weeks. Surveys are easy and payouts are always on time.",
      rating: 4.7,
      date: 'May 2026',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150',
    },
    {
      name: 'James R.',
      location: 'CANADA',
      text: "The best survey platform I've used. Fast withdrawals and lots of daily opportunities.",
      rating: 4.5,
      date: 'Jun 2026',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
    },
    {
      name: 'Emma K.',
      location: 'UNITED KINGDOM',
      text: "I love the referral program and the variety of rewards available. Highly recommended!",
      rating: 4.9,
      date: 'Apr 2026',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#00b67a05,transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,#00b67a05,transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00b67a]/10 rounded-full text-[#00b67a] text-xs font-black uppercase tracking-widest mb-6"
          >
            <Star className="w-4 h-4 fill-[#00b67a]" /> Trusted by 100,000+ Users
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black text-gray-900 font-display tracking-tight mb-4"
          >
            Real Reviews, Real Rewards
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-500 font-medium tracking-tight"
          >
            See why we are the top-rated choice for survey earners worldwide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-[#00b67a10] hover:border-[#00b67a20] transition-all duration-500 group relative flex flex-col"
            >
              <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-12 h-12 text-[#00b67a]" />
              </div>

              <TrustpilotRating rating={testimonial.rating} date={testimonial.date} />

              <p className="text-gray-700 leading-relaxed font-bold text-lg mb-8 relative z-10 flex-1">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00b67a] border-2 border-white rounded-full shadow-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-black text-gray-900 text-base tracking-tight leading-none mb-1">{testimonial.name}</h4>
                  <p className="text-[10px] font-black text-[#00b67a] uppercase tracking-[0.2em]">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
