import { motion } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Navbar() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Surveys', id: 'surveys' },
    { name: 'Rewards', id: 'rewards' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    if (location.pathname !== '/') return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  // Handle cross-page scrolling
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => {
        scrollToSection(id);
        // Clear state
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => scrollToSection('home')} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-xl uppercase">
                {settings.logoText}
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900">
                {settings.name}
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.id === 'contact' ? (
                <Link
                  key={link.id}
                  to="/contact"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/contact' ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === link.id ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </button>
              )
            ))}
          </div>

          {/* Desktop Login/CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-900 hover:text-primary transition-colors duration-200"
            >
              Log in
            </Link>
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:focus:ring-2 hover:bg-gray-800 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              Sign up free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg"
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              link.id === 'contact' ? (
                <Link
                  key={link.id}
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`text-left text-base font-medium transition-colors ${
                    location.pathname === '/contact' ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-left text-base font-medium transition-colors ${
                    activeSection === link.id ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </button>
              )
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
              <Link
                to="/login"
                className="text-base font-medium text-gray-900 text-center py-2 bg-gray-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
              <Link 
                to="/signup"
                className="rounded-lg bg-primary py-3 text-base font-medium text-white shadow-sm text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign up free
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
