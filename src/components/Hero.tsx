import { motion } from 'motion/react';
import { Sparkles, Star, Users, Coins, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();
  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-theme-surface selection:bg-primary/20 selection:text-primary">
      {/* Background gradients for modern feel */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] sm:left-[-10%] w-[40%] sm:w-[50%] h-[50%] rounded-full bg-orange-100/40 blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-8">
          
          {/* Left Column - Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-sm font-medium text-primary mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 5,000+ {settings.name} participants</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-theme-text tracking-tight leading-[1.05] mb-6 font-display"
            >
              Get Paid For <br />
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Sharing Your</span>
                {/* Decorative underline */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" />
                </svg>
              </span>
              <br />
              Opinion.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-theme-text-muted mb-10 leading-relaxed max-w-xl"
            >
              {settings.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link 
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg shadow-lg shadow-orange-500/30 hover:bg-primary-hover hover:shadow-orange-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
              >
                Start Earning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-theme-surface text-theme-text font-semibold text-lg border border-theme-border shadow-sm hover:border-gray-300 hover:bg-theme-bg hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                How It Works
              </a>
            </motion.div>

            {/* Statistics Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-theme-border"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-theme-text text-xl font-display">4.9</span>
                </div>
                <span className="text-sm font-medium text-theme-text-muted">App Store Rating</span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-bold text-theme-text text-xl font-display">5k+</span>
                </div>
                <span className="text-sm font-medium text-theme-text-muted">Active Members</span>
              </div>

              <div className="flex flex-col col-span-2 md:col-span-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Coins className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-theme-text text-xl font-display">$250k+</span>
                </div>
                <span className="text-sm font-medium text-theme-text-muted">Paid to Users</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Mockup */}
          <div className="relative lg:ml-auto w-full max-w-lg mx-auto lg:max-w-none mt-16 lg:mt-0 lg:pl-12">
            {/* Soft glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[120%] bg-gradient-to-br from-orange-400/20 via-primary/20 to-transparent blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative flex justify-center">
              
              {/* Premium Floating Card 1 (Top Right) */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-8 -right-4 sm:-right-16 z-30"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-theme-surface/70 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-2xl shadow-orange-500/10 w-64 transform rotate-[4deg]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-inner">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider">Payment Sent</p>
                      <p className="text-sm font-bold text-theme-text">+$25.00 to PayPal</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Premium Floating Card 2 (Bottom Left) */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-32 -left-4 sm:-left-20 z-30"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="bg-theme-surface/70 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-2xl shadow-orange-500/10 w-[270px] transform -rotate-[3deg]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 shadow-inner">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider">New Survey</p>
                      <p className="text-sm font-bold text-theme-text line-clamp-1">Tech Habits 2024</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                        +$5.00
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Mobile Phone Mockup container */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative z-20 w-[320px] h-[640px] bg-theme-text rounded-[3.5rem] p-3.5 shadow-2xl shadow-gray-900/30 border border-gray-800 ring-4 ring-gray-900/5"
              >
                {/* Screen */}
                <div className="w-full h-full bg-theme-bg rounded-[2.5rem] overflow-hidden relative flex flex-col">
                  {/* Dynamic Island / Notch area */}
                  <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
                    <div className="w-32 h-6 bg-theme-text rounded-b-3xl"></div>
                  </div>

                  {/* App Content */}
                  <div className="flex-1 p-6 pt-12 overflow-y-auto hide-scrollbar flex flex-col gap-6 bg-theme-bg">
                    {/* App Header (Balance) */}
                    <div className="text-center bg-theme-surface p-5 rounded-3xl shadow-sm border border-theme-border mt-2">
                      <p className="text-sm text-theme-text-muted font-medium mb-1">Available Balance</p>
                      <h2 className="text-4xl font-display font-bold text-theme-text">$124.50</h2>
                      <button className="mt-4 w-full bg-theme-text text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                        Cash Out
                      </button>
                    </div>

                    {/* Daily Goal */}
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-xs font-bold text-primary mb-0.5">DAILY GOAL</p>
                          <p className="text-sm font-medium text-theme-text">Complete 3 surveys</p>
                        </div>
                        <span className="text-sm font-bold text-theme-text">2/3</span>
                      </div>
                      <div className="w-full bg-orange-200/50 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-2/3"></div>
                      </div>
                    </div>

                    {/* Available Surveys List */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-theme-text text-sm">Available Surveys</h3>
                        <a href="#" className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center">
                          See all <ChevronRight className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Survey Item 1 */}
                        <div className="bg-theme-surface p-3.5 rounded-2xl shadow-sm border border-theme-border flex items-center gap-3 cursor-pointer hover:border-orange-200 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <span className="text-blue-600 font-bold text-sm">N</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-theme-text">Consumer Habits</h4>
                            <p className="text-xs text-theme-text-muted">15 mins • Brand Study</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-emerald-600">+$2.50</span>
                          </div>
                        </div>

                        {/* Survey Item 2 */}
                        <div className="bg-theme-surface p-3.5 rounded-2xl shadow-sm border border-theme-border flex items-center gap-3 cursor-pointer hover:border-orange-200 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                            <span className="text-purple-600 font-bold text-sm">S</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-theme-text">Music Streaming</h4>
                            <p className="text-xs text-theme-text-muted">10 mins • Entertainment</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-emerald-600">+$1.80</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mockup Tab Bar */}
                  <div className="bg-theme-surface border-t border-theme-border p-4 pb-6 flex justify-around items-center rounded-b-[2.5rem]">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-sm" />
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
