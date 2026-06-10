import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border border-gray-100 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="text-gray-900 font-bold text-base md:text-lg pr-8">
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 text-gray-500 font-medium leading-relaxed border-t border-gray-50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I earn rewards?',
      answer: 'Complete available surveys and earn rewards for each successful completion. Each survey has a specific reward amount listed before you start.',
    },
    {
      question: 'How long does it take to receive payments?',
      answer: 'Most withdrawals are processed within 24-48 hours depending on the selected payout method. Electronic gift cards and PayPal are typically the fastest options.',
    },
    {
      question: 'What reward options are available?',
      answer: 'You can redeem rewards through PayPal, Visa, Amazon, Google Play, Apple Gift Cards, and many more options in our comprehensive rewards catalog.',
    },
    {
      question: 'Is SurveyEarn free to join?',
      answer: 'Yes. Registration is completely free and there are no hidden fees. We will never ask for your credit card information to join the platform.',
    },
    {
      question: 'Why do some surveys disqualify me?',
      answer: 'Survey providers look for specific demographics to match their research goals. If you do not match the required profile for a particular study, you may be screened out early.',
    },
    {
      question: 'Which countries are supported?',
      answer: 'Survey opportunities are available globally, though availability and reward amounts may vary significantly by location and current market research demand.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-orange-50 blur-[100px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-50 blur-[100px] rounded-full pointer-events-none opacity-50" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 font-display tracking-tight mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            Everything you need to know before getting started.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 text-center"
        >
            <p className="text-gray-900 font-bold mb-4">Still have questions?</p>
            <Link to="/contact" className="text-primary font-bold hover:text-primary-hover underline underline-offset-4 transition-colors">
                Contact our support team
            </Link>
        </motion.div>
      </div>
    </section>
  );
}
