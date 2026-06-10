import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Clock, Send, CheckCircle2, User, FileText, HelpCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSettings } from '../context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Info Section */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-6">
                  <MessageSquare className="w-3 h-3" />
                  Get in Touch
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8">
                  Contact Us<span className="text-gray-300">.</span>
                </h1>
                <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
                  Have questions or need assistance? Our support team is here to help you make the most of our platform.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50 space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <Mail className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Support Email</h3>
                    <p className="text-sm text-gray-500 font-medium">{settings.supportEmail}</p>
                  </div>
                </div>

                <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50 space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <FileText className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Business Inquiries</h3>
                    <p className="text-sm text-gray-500 font-medium">{settings.businessEmail}</p>
                  </div>
                </div>

                <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50 space-y-4 col-span-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                      <Clock className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Expected Response Time</h3>
                      <p className="text-sm text-gray-500 font-medium">We typically respond to all inquiries within 24–48 business hours.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2.5rem] border border-gray-200 shadow-2xl p-10 lg:p-12"
            >
              {isSuccess ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Message Sent!</h2>
                    <p className="text-gray-500 font-medium tracking-tight">We've received your request and will get back to you soon.</p>
                  </div>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg text-xs tracking-widest uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Your Name
                      </label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 outline-none focus:bg-white focus:border-gray-900 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email Address
                      </label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 outline-none focus:bg-white focus:border-gray-900 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <HelpCircle className="w-3 h-3" />
                      Subject
                    </label>
                    <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 outline-none focus:bg-white focus:border-gray-900 transition-all font-bold appearance-none">
                      <option>General Support</option>
                      <option>Account Billing</option>
                      <option>Bug Report</option>
                      <option>Business Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" />
                      Message
                    </label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="How can we help you?"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 outline-none focus:bg-white focus:border-gray-900 transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl text-xs tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-widest leading-relaxed">
                    By submitting this form, you agree to our privacy policy and terms of service regarding data collection.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
